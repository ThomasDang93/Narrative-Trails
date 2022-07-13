import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
function StampResources ({ letterbox }) {
  return (
    <div className="container">
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
            <div key={props.id} >
              <Card>
                  <CardImg top width="100%" src={ props.src} alt="Card image cap" />
              </Card>
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default StampResources;