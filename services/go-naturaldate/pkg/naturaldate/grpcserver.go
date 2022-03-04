package naturaldate

import (
	"context"
	"log"

	"github.com/bjarke-xyz/dates/go-naturaldate/pkg/api/proto"
	"github.com/tj/go-naturaldate"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type GRPCServer struct {
	proto.UnimplementedNaturalDateServer
}

func (s *GRPCServer) Parse(ctx context.Context, req *proto.ParseNaturalDateRequest) (*proto.ParseNaturalDateResponse, error) {
	log.Default().Printf("Request: %v", req)

	// base time.
	base := req.BaseDate.AsTime()

	time, err := naturaldate.Parse(req.NaturalDate, base)
	if err != nil {
		log.Default().Printf("Response: %v", err)
		return nil, err
	}

	response := &proto.ParseNaturalDateResponse{
		ParsedDate: timestamppb.New(time),
	}

	log.Default().Printf("Response: %v", response)

	return response, nil
}
