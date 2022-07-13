import { Link } from 'react-router-dom';

function MyStamp ({ stamp }) {
  
  return (
    <div>
        {stamp.stampList.length > 0 ? 
        stamp.stampList.map(function(props) {
            return (
            <div key={props.id} >
                <Link to={`/stamp/${props.id}`}>
                    <img key={ props.src } src={ props.src } alt="no image" width="100" height="100"/>
                </Link>
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default MyStamp;