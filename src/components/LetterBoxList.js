import { Link } from 'react-router-dom';

function LetterBoxList ({ letterbox }) {
  return (
    <div>
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
            <div key={props.id} >
                <Link to={`/letterbox/${props.id}`}>
                    <img key={ props.src } src={ props.src } alt="no image" width="100" height="100"/>
                </Link>
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default LetterBoxList;