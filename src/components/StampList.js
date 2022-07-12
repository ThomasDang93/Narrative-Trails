import { Link } from 'react-router-dom';

function StampList ({ stampList }) {
  return (
    <div>
        {stampList.stampBoxList.length > 0 ? 
        stampList.stampBoxList.map(function(props) {
            return (
            <div key={props.src} >
                <Link to={`/stamp/${props.src}`}>
                    <img key={ props.src } src={ props.src } alt="no image" width="100" height="100"/>
                </Link>
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default StampList;