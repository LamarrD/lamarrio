terraform {
  required_version = ">= 1.2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "s3" {
  }
}

provider "aws" {
  region              = "us-east-1"
}


resource "aws_s3_bucket" "bucket" {
  bucket_prefix = "lamarrio-"
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.bucket.arn}/*"
        Condition = {
          StringEquals = {
            "aws:SourceArn" = aws_cloudfront_distribution.distribution.arn
          }
        }
      },
    ]
  })
}


resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "Default"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name              = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = "lamarrio"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "lamarrio"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    lambda_function_association {
      event_type    = "origin-request"
      lambda_arn    = "${aws_lambda_function.rewriter-lambda.qualified_arn}"
      include_body  = false
    }
  }

    custom_error_response {
    error_code            = 403
    response_page_path    = "/index.html"
    response_code         = 200
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code            = 404
    response_page_path    = "/index.html"
    response_code         = 200
    error_caching_min_ttl = 300
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "SE", "FI"]
    }
  }

  aliases = ["lamarr.io"]

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:${var.account_id}:certificate/1569a5e0-e9c4-4c50-b37b-80bc14ea9204"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }
  
}

resource "aws_iam_role" "rewriter_role" {
  name = "rewriter-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      },
      {
        Effect = "Allow",
        Principal = {
          Service = "edgelambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

data "archive_file" "rewriter" {
  type        = "zip"
  source_file = "${path.module}/rewriter.py"
  output_path = "${path.module}/rewriter.zip"
}

resource "aws_lambda_function" "rewriter-lambda" {
  function_name    = "rewriter"
  timeout          = 3
  memory_size      = 128
  handler = "rewriter.lambda_handler"
  runtime = "python3.8"
  role    = aws_iam_role.rewriter_role.arn
  filename = data.archive_file.rewriter.output_path
  source_code_hash = data.archive_file.rewriter.output_base64sha256
  publish = true
}

resource "aws_route53_record" "www" {
  zone_id = "Z10011762I7QSZINCCVWT"
  name    = "lamarr.io"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_iam_role" "github_actions_role_lamarrio" {
  name = "github-actions-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = "repo:lamarrd/lamarrio:ref:refs/heads/main"
          }
        }
      }
    ]
  })
}
resource "aws_iam_policy" "github_actions_policy" {
  name        = "github-actions-policy"
  description = "Policy to allow GitHub Actions to access specific AWS resources"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "s3:ListBucket",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.bucket.bucket}",
          "arn:aws:s3:::${aws_s3_bucket.bucket.bucket}/*"
        ]
      },
      {
        Effect   = "Allow"
        Action   = [ "cloudfront:CreateInvalidation"]
        Resource = [aws_cloudfront_distribution.distribution.arn]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions_policy_attachment" {
  role       = aws_iam_role.github_actions_role_lamarrio.name
  policy_arn = aws_iam_policy.github_actions_policy.arn
}