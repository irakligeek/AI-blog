
//import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Logo() {
    return (<div className="text-3xl text-center py-4 font-heading">
        <FontAwesomeIcon icon={faRobot} className="text-3xl text-white/95 pr-3"/>
        <span className=" tracking-widest">AI Blog</span>
    </div>);
}