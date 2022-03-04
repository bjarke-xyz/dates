package main

import (
	"log"
	"net"
	"os"

	"github.com/bjarke-xyz/dates/go-naturaldate/pkg/api/proto"
	"github.com/bjarke-xyz/dates/go-naturaldate/pkg/naturaldate"
	"google.golang.org/grpc"
)

func main() {
	s := grpc.NewServer()
	srv := &naturaldate.GRPCServer{}

	proto.RegisterNaturalDateServer(s, srv)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Listening on %v", port)
	if err := s.Serve(listener); err != nil {
		log.Fatal(err)
	}
}
