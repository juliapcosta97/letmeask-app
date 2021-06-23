import {BaseHTMLAttributes} from "react";

import '../styles/button.scss';

type ButtonProps = BaseHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps){
    return (
        <div>
            <button className="button" {...props} />
        </div>
    );
}

