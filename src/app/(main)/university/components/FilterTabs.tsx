interface FilterTabsProbs {
    label: string;
    filters: string[];
}

const FilterTabs = ({label, filters}: FilterTabsProbs) =>{
    return (
        <div className="flex px-2 py-1 border border-[#7B68EE] items-center gap-1 rounded-[8px] text-[#7B68EE]">
            <p>
                {label}:
            </p>
            <div className="font-bold">
                {
                    filters.map((filter, index) => (
                        <p key={index + 123124}>
                            {filter}{index < filters.length - 1 ? "," : ""}
                        </p>
                    ))
                }
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                    d="M9.53231 0.465282C9.69527 0.625615 9.71008 0.876509 9.57675 1.05331L9.53231 1.10396L5.57293 4.99967L9.53231 8.89539C9.69527 9.05572 9.71008 9.30662 9.57675 9.48342L9.53231 9.53407C9.36934 9.6944 9.11434 9.70898 8.93464 9.57779L8.88316 9.53407L4.599 5.31901C4.43604 5.15868 4.42123 4.90779 4.55456 4.73099L4.599 4.68034L8.88316 0.465282C9.06242 0.288916 9.35305 0.288916 9.53231 0.465282Z"
                    fill="#7B68EE"/>
                <path
                    d="M0.467939 0.465282C0.304978 0.625615 0.290163 0.876509 0.423495 1.05331L0.467939 1.10396L4.42731 4.99967L0.467939 8.89539C0.304978 9.05572 0.290163 9.30662 0.423495 9.48342L0.467939 9.53407C0.6309 9.6944 0.885907 9.70898 1.0656 9.57779L1.11709 9.53407L5.40124 5.31901C5.5642 5.15868 5.57901 4.90779 5.44568 4.73099L5.40124 4.68034L1.11709 0.465282C0.937829 0.288916 0.647196 0.288916 0.467939 0.465282Z"
                    fill="#7B68EE"/>
            </svg>
        </div>
    );
}

export default FilterTabs;