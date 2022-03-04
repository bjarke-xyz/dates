#!/usr/bin/env bash

protoc --go_out=pkg --go_opt=paths=source_relative --go-grpc_out=pkg --go-grpc_opt=paths=source_relative api/proto/naturaldate.proto
