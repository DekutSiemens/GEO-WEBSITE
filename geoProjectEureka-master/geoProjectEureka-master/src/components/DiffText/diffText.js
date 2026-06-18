import React from "react";

const DiffText = () => {

    return (
        <div className="diff aspect-[4/2]">
            <div className="diff-item-1">
                <div className="bg-medium-blue text-primary-content text-9xl font-black grid place-content-center">Error 404</div>
            </div>
            <div className="diff-item-2">
                <div className="bg-base-200 text-9xl font-black grid place-content-center">Error 404</div>
            </div>
            <div className="diff-resizer"></div>
        </div>
    );
}

export default DiffText;