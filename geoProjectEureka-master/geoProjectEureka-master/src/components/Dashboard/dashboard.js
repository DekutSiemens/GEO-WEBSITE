import React, { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card/card";



const Dashboard = ({Data, role}) => {
  const [numberProjects, setNumberProjects] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);
  const [selectedAutor, setSelectedAutor] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
 
  const navigate = useNavigate(); 
  const handleCreateProject = () => {
    navigate('/create-project');
  };

  if (Data === null || Data === undefined) {
    Data = []
  } 

  const dataWithUnknownAutors = Data.map(item => ({
      ...item,
      autor: item.autor || "Unknown"
  }));
  const sortedData = dataWithUnknownAutors.sort((a, b) =>  new Date(b.date.slice(-4),b.date.slice(3,5),b.date.slice(0,2)) - new Date(a.date.slice(-4),a.date.slice(3,5),a.date.slice(0,2)));
  const filteredData1 = selectedAutor === "all" ? sortedData : sortedData.filter(item => item.autor === selectedAutor);
    
  const filteredDataBySearch = searchTerm.startsWith("#")
    ? filteredData1.filter(item => item.autor.toLowerCase().includes(searchTerm.slice(1).toLowerCase()))
    : filteredData1.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredDataBySearch.length / itemsPerPage);


    const currentData = filteredDataBySearch.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const cards = currentData.map((item, index)=>{
      
      return (

        <div className="pb-6 pt-6 flex justify-center" key={item.id}>
          <Card
            role={role}
            mediaFiles={item.medias}
            date={item.date}
            title={item.title}
            geology={item.geology}
            geochemistry={item.geochemistry}
            geophysics={item.geophysics}
            autor={item.autor}
            favorite={item.favorite}
            id={item.id}
            datas={item.datas}
            userId={item.userId}
          />
        </div>
      )    
    })
    const uniqueAutors = [...new Set(dataWithUnknownAutors.map(item => item.autor))];

    useEffect(() => {
      setNumberProjects(cards.length);
    }, [cards.length]);

    const scrollRef = useRef(null);

    useEffect(() => {
      const handleScroll = () => {
        if (scrollRef.current) {
          const scrollTop = scrollRef.current.scrollTop;
          const clientHeight = scrollRef.current.clientHeight;
          const scrollHeight = scrollRef.current.scrollHeight;
    
          const firstVisibleProjectIndex = Math.floor(scrollTop / clientHeight) + 1;
          const totalProjects = filteredData1.length;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    
          // Update the scrollCount by the scroll
          if (isAtBottom) {
            setScrollCount(itemsPerPage>totalProjects?totalProjects:itemsPerPage);
          } else {
            setScrollCount(Math.max(firstVisibleProjectIndex, 1));
          }
        }
      };
    
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
      }
    
      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }, [filteredData1]);
    
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const renderPaginationButtons = () => {
      const maxButtons = 5; // Maximum number of buttons to show
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
  
      const buttons = [];
      if (startPage > 1) {
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            1
          </button>
        );
        if (startPage > 2) {
          buttons.push(<span key="ellipsis-start">...</span>);
        }
      }
  
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            {i}
          </button>
        );
      }
  
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(<span key="ellipsis-end">...</span>);
        }
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            {totalPages}
          </button>
        );
      }
  
      return buttons;
    };

    return (
      <div className="flex flex-nowrap">
        <div className="w-full md:w-1/6 flex justify-center md:justify-start">

        </div>

        <div className="space-y-8 w-4/6">
          <div className=" pb-2 border border-gray-200 rounded-lg">
            <div className="flex justify-center space-x-8">
              <div className="flex items-center">
                  <label className="form-control max-w-xs">
                      <div className="label">
                          <span className="label-text">Autor :</span>
                      </div>
                      <select className="select select-bordered custom-select" value={selectedAutor} onChange={(e) => setSelectedAutor(e.target.value)}>
                          <option value="all">all</option>
                          {uniqueAutors.map((autor, index) => (
                              <option key={index} value={autor}>{autor}</option>
                          ))}
                      </select>
                  </label>
              </div>
              <div className="flex items-center">
                  <label className="form-control max-w-xs">
                      <div className="label">
                          <span className="label-text">Projects :</span>
                      </div>
                      <p className="h-12 flex items-center justify-center custom-select">{scrollCount}/{numberProjects}</p>
                  </label>
              </div>
            </div>
            <div>
              <div className="flex justify-center pb-2 pt-4 pl-2 pr-2">
                <input
                  type="text"
                  className="input input-bordered w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg bg-light-grey text-black"
                  placeholder="Search by title or #autor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pb-2 pt-2 w-auto max-h-screen shadow-2xl border border-gray-200 rounded-lg overflow-y-auto custom-scrollbar" ref={scrollRef}>
            {Data.length > 0 ? cards : <h1 className="flex justify-center pt-2">No Projects found !</h1>}
          </div>

          <div className="flex justify-center space-x-2">
            {renderPaginationButtons()}
          </div>
        </div>

      <div className="w-full md:w-1/6 flex justify-center md:justify-end pt-2 pl-4 pr-4">
        <div>
        <button onClick={handleCreateProject} className="hover:bg-light-blue bg-gradient-to-br bg-medium-blue hover:bg-light-blue border-solid border-2 border-light-blue  font-bold text-white px-5 py-2 rounded-full ">Create project</button>
        </div>
      </div>

    </div>
     );
}

export default Dashboard;