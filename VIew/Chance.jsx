import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CurrentUserNameSingleton from './UserSingleton';

export default function Chance(props){

    const Life = {
        L1 : true,
        L2 : true,
        L3 : true
    }
    let HowManyLife = parseInt(props.HowManyLife);
    if(HowManyLife === 3){
        Life.L1 = true;
        Life.L2 = true;
        Life.L3 = true;
    }
    else if(HowManyLife === 2){
        Life.L1 = true;
        Life.L2 = true;
        Life.L3 = false;
    }
    else if(HowManyLife === 1){
        Life.L1 = true;
        Life.L2 = false;
        Life.L3 = false;
    }
    else if(HowManyLife === 0){
        Life.L1 = false;
        Life.L2 = false;
        Life.L3 = false;
    }
    else{
        Life.L1 = true;
        Life.L2 = true;
        Life.L3 = true;
    }

    let UserData = CurrentUserNameSingleton.getUserName();

    return(
        <div className="container-fluids">
                &nbsp;&nbsp;&nbsp;
                <p className="fw-bold"><i className="bi bi-person-fill"></i></p>
                <p className="fw-bold">{UserData.name}</p>
                <p className="fw-bold">
                    {Life.L1 ? <i className="bi bi-suit-heart-fill"> </i> : <i className="bi bi-suit-heart"> </i>}
                    {Life.L2 ? <i className="bi bi-suit-heart-fill"> </i> : <i className="bi bi-suit-heart"> </i>}
                    {Life.L3 ? <i className="bi bi-suit-heart-fill"> </i> : <i className="bi bi-suit-heart"> </i>}
                </p>
        </div>
    );
    
} 