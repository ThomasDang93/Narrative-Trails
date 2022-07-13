import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
function LetterBoxList ({ letterbox }) {
  return (
    <div className="container">
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
            <div key={props.id} >
              <Card>
                <Link to={`/letterbox/${props.id}`}>
                  <CardImg top width="100%" src={ props.src} alt="Card image cap" />
                </Link>
                <CardBody>
                    <CardTitle><h1>{props.name} {" #"}{props.id}</h1></CardTitle>
                    <CardText><b>Description: </b> {props.description}</CardText>
                  <Link to={`/letterbox/${props.id}`}>
                    <Button>View</Button>
                  </Link>
                </CardBody>
              </Card>
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default LetterBoxList;