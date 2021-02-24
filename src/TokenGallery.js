import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  CardDeck,
  Col,
  Card,
  ButtonGroup,
  Button,
  Row,
  Pagination,
  Container,
} from "react-bootstrap";

import { tokenHighlightImage, tokenGenerator, tokenThumbImage } from "./utils";
import "./Project.css";

const TokenGallery = ({ project, projectTokens = [] }) => {
  const location = useLocation();
  const history = useHistory();
  const pageParam = new URLSearchParams(location.search).get("p") || 1;
  const currentPage = parseInt(pageParam);

  // Image loading queue
  const [loadQueue, setLoadQueue] = React.useState(project * 1000000);
  function handleNextImage() {
    //console.log('clicked');
    let currentCard = loadQueue;
    let nextCard = currentCard + 1;
    setLoadQueue(nextCard);
  }

  // Reset load queue to current page
  React.useEffect(() => {
    setLoadQueue(project * 1000000 + (currentPage - 1) * 20);
  }, [currentPage, project]);

  // Set up Pagination Items
  const pageNumbers = [];
  const totalPages = Math.ceil(projectTokens.length / 20);
  const start = Math.max(1, currentPage - 3);
  const end = Math.min(totalPages, start + 7);
  pageNumbers.push(
    <Pagination.Prev
      key={"prev"}
      disabled={currentPage === 1}
      as={Link}
      to={Math.max(currentPage - 1, 1)}
    />
  );
  for (let pageNumber = start; pageNumber <= end; pageNumber++) {
    pageNumbers.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === currentPage}
        onClick={() => history.push(`${location.pathname}?p=${pageNumber}`)}
      >
        {pageNumber}
      </Pagination.Item>
    );
  }
  if (end < totalPages) {
    pageNumbers.push(<Pagination.Ellipsis />);
    pageNumbers.push(
      <Pagination.Item
        key={totalPages}
        as={Link}
        onClick={() => history.push(`${location.pathname}?p=${totalPages}`)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }
  pageNumbers.push(
    <Pagination.Next
      key={"next"}
      disabled={currentPage === totalPages}
      as={Link}
      to={Math.min(currentPage + 1, totalPages)}
    />
  );

  return (
    <div>
      <CardDeck>
        {projectTokens.map((token, index) => {
          if (
            projectTokens
              .slice((currentPage - 1) * 20, currentPage * 20)
              .includes(token)
          ) {
            return (
              <div key={token}>
                <Col>
                  <Card
                    border="light"
                    className="mx-auto"
                    style={{ width: "16rem" }}
                  >
                    <Card.Body>
                      {loadQueue < token ? (
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <Card.Img
                          variant="top"
                          src={tokenThumbImage(token)}
                          onLoad={handleNextImage}
                        />
                      )}
                      <div className="text-center">
                        <ButtonGroup size="sm">
                          <Button variant="light" disabled>
                            #{Number(token) - Number(project) * 1000000}
                          </Button>
                          <Button
                            as={Link}
                            to={"/token/" + token}
                            variant="light"
                          >
                            Details
                          </Button>
                          <Button
                            variant="light"
                            onClick={() =>
                              window.open(tokenHighlightImage(token), "_blank")
                            }
                          >
                            Image
                          </Button>
                          <Button
                            variant="light"
                            onClick={() =>
                              window.open(tokenGenerator(token), "_blank")
                            }
                          >
                            Live
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            );
          } else {
            return null;
          }
        })}
      </CardDeck>
      <Row>
        <Container className="mx-1">
          <div className="text-xs-center">
            <br />
            <Pagination className="flex-wrap text-left">
              {pageNumbers}
            </Pagination>
            <br />
          </div>
        </Container>
      </Row>
      {/* <div className="text-center">
        <Button
          className="btn-light btn-sm"
          onClick={() =>
            this.props.handleToggleView("gallery", this.state.project)
          }
        >
          Back To Project List
        </Button>
      </div> */}
    </div>
  );
};

export default TokenGallery;