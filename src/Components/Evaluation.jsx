import React, { useContext, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import UserContext from '../Context/UserContext';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Evaluation = () => {
    const { scripts } = useContext(UserContext);
    const EvaluatorId = localStorage.getItem('evaluatorId');
    const scriptWithEvaluatorId = scripts.find(script => script.evaluatorId === EvaluatorId);
    // eslint-disable-next-line 
    const scriptId = scriptWithEvaluatorId ? scriptWithEvaluatorId._id : null;
    const location = useLocation();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0); // Initial scale
    const [marks, setMarks] = useState({
        1: {
            a: '',
            b: '',
            c: '',
            d: '',
            e: '',
            f: '',
            g: '',
            h: '',
            i: '',
            j: ''
        },
        2: {
            a: '',
            b: '',
            c: '',
            d: '',
            e: '',
            f: '',
            g: '',
            h: '',
            i: '',
            j: '',
            k: '',
            l: ''
        },
        3: {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    });

    const searchParams = new URLSearchParams(location.search);
    const evaId = searchParams.get('evaluatorId');
    const script = searchParams.get('scriptId')
    const pdfUrl = searchParams.get('pdfUrl');

    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleZoomIn = () => {
        setScale(prevScale => prevScale + 0.1); // Increase scale by 0.1
    };

    const handleZoomOut = () => {
        setScale(prevScale => Math.max(0.1, prevScale - 0.1)); // Decrease scale by 0.1, ensuring minimum scale of 0.1
    };

    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(prevPageNumber => prevPageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
    };

    const handleInputChange = (event, page, question) => {
        // eslint-disable-next-line 
        const { name, value } = event.target;
        setMarks(prevMarks => ({
            ...prevMarks,
            [page]: {
                ...prevMarks[page],
                [question]: value
            }
        }));
    };


    const handleDoneClick = async () => {
        console.log(evaId)
        try {

            await axios.put(`https://exam-script-backend-1.onrender.com/api/studentScripts/${script}`, {evaluatorId :evaId, marks, status: 'checked' });
            alert('Marks uploaded successfully');
        } catch (error) {
            console.error('Error updating marks or setting status:', error);
            // Handle error, if needed
        }
    };


    const renderForm = () => {
        return (
            <form className="mt-4 flex justify-evenly w-[40rem]">
                {[1, 2, 3].map(page => (
                    <div key={page}>
                        <h3 className='text-[1.3rem] w-fit p-1 px-3 ml-[-3rem]'>{page}.</h3>
                        {Object.keys(marks[page]).map(question => (
                            <div key={question} className="flex items-center justify-between">
                                <label htmlFor={`page-${page}-${question}`} className="mr-2 mb-5">{question.toUpperCase()}</label>
                                <input
                                    type="text"
                                    id={`page-${page}-${question}`}
                                    name={`page-${page}-${question}`}
                                    value={marks[page][question]}
                                    onChange={(event) => handleInputChange(event, page, question)}
                                    className="border border-black p-1 mb-5 w-[3rem]"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </form>
        );
    };

    return (
        <div className='p-4'>
            <div className="flex">
                <div className="w-[50%] border border-black" style={{ height: '95vh', overflow: 'auto' }}>
                    <div className="flex justify-center gap-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={handleZoomIn}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={handleZoomOut}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                        </svg>
                    </div>
                    <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess}>
                        <div style={{ height: '80vh' }}>
                            <Page pageNumber={pageNumber} scale={scale} />
                        </div >
                    </Document>
                    <div className='absolute bottom-0 flex gap-11 justify-center w-[40%]'>
                        <button onClick={goToPrevPage} className='border border-black mb-9 p-1'>Previous</button>
                        <button onClick={goToNextPage} className='border border-black mb-9 p-1 px-5'>Next</button>
                    </div>
                </div>
                <div className="flex flex-col ">
                    <div className="w-[50%]">
                        {renderForm()}
                    </div>
                    <button onClick={handleDoneClick} className='bg-[#c4ffc4] flex justify-center w-[25rem] p-3 mt-[7rem] ml-[10rem]'>Done</button>
                </div>
            </div>
        </div>
    );
}

export default Evaluation;
