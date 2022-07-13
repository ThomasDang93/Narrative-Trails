import './components.css';
import { Card, CardImg} from 'reactstrap';
function StampList ({ stampList }) {
  return (
    <div className="grid">
        {stampList.stampBoxList.length > 0 ? 
        stampList.stampBoxList.map(function(props) {
            return (
            <div key={props.src} >
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
 
export default StampList;