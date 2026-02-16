provider "aws" {
  region = var.aws_region
}

resource "aws_ecr_repository" "api" {
  name = "nexadesk-api"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = {
    project = "nexadesk"
    env     = var.environment
  }
}
