import React,{useState} from 'react'
import useCreateProject from '../../hooks/data/post/useCreateProject';
import ButtonValidationForm from '../ButtonValidationForm/buttonValidationForm';
import { Link } from 'react-router-dom';
import Input from '../Input/input';
import FilesUploader from '../FilesUploader/filesUploader';

const CreateProjectForm = () => {
    const {handleSubmit, isLoading, alertBanner} = useCreateProject();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelection = (files) => {
        setSelectedFiles(files);
    };

    return (            
        <form action="#" method="POST" onSubmit={(e) => handleSubmit(e, selectedFiles)}>
            {alertBanner && alertBanner}

            <div className="border-b border-gray-900/10 pb-2 pl-4 pr-4">
                <h2 className="text-2xl font-semibold leading-2 pb-4 pt-2">Create project :</h2>

                <div className="flex flex-col lg:flex-row lg:space-x-4">
                    <div className="lg:w-1/12"></div>
                    <div className="lg:w-10/12 space-y-4">
                        <div className="space-y-4 pb-2 pl-2 pr-2 border border-gray-200 rounded-lg">
                            <h2 className="text-xl font-semibold leading-2 pb-2 pt-2 pl-2">General :</h2>
                            <div className='pb-2 border-b border-gray-200'>
                                <FilesUploader id='filesUploader' handleFileSelection={handleFileSelection}/>
                            </div>
                            <div className="flex justify-center items-center">
                                <Input type='text' isLabel={true} isRequired={true} title='Project name' id='projectName' size="max-w-xs w-full"/>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input type='text' isLabel={true} title='Location' id='location' size="w-full"/>
                                <Input type="text" isLabel={true} title="Sample type" id="sampleType" size="w-full"/>
                                <Input type="date" isLabel={true} title="Collection date" id="collectionDate" defaultValue={new Date().toISOString().split('T')[0]} size="w-full"/>
                            </div>
                        </div>

                        <div className="space-y-2 pb-2 pl-2 pr-2 border border-gray-200 rounded-lg">
                            <h2 className="text-xl font-semibold leading-2 pb-2 pt-2 pl-2">Geochemistry :</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Input type="number" isLabel={true} title="Depth" id="depth" size="w-full"/>
                                <Input type="number" isLabel={true} title="Temperature" id="temperature" size="w-full"/>
                                <Input type="number" isLabel={true} title="pH" id="pH" size="w-full"/>
                                <Input type="number" isLabel={true} title="Electrical conductivity" id="electricalConductivity" size="w-full"/>
                            </div>
                            <Input type='textarea' isLabel={true} title='Geochemistry comment' id='geochemistryComment' size="w-full"/>
                        </div>

                        <div className="space-y-4 pb-2 pl-2 pr-2 border border-gray-200 rounded-lg">
                            <h2 className="text-xl font-semibold leading-2 pb-2 pt-2 pl-2">Geology :</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input type='text' isLabel={true} title='Lithology' id='lithology' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Mineralogy' id='mineralogy' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Texture' id='texture' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Structure' id='structure' size="w-full"/>
                                </div>
                                <div>
                                    <Input type='text' isLabel={true} title='Alteration' id='alteration' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Geochimical analysis' id='geochimicalAnalysis' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Hydrothermal features' id='hydrothermalFeatures' size="w-full"/>
                                </div>
                            </div>
                            <Input type='textarea' isLabel={true} title='Geology comment' id='geologyComment' size="w-full"/>
                        </div>

                        <div className="space-y-4 pb-2 pl-2 pr-2 border border-gray-200 rounded-lg"> 
                            <h2 className="text-xl font-semibold leading-2 pb-2 pt-2 pl-2">Geophysics :</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input type='text' isLabel={true} title='Method' id='method' size="w-full"/>
                                    <Input type='number' isLabel={true} title='Depth of penetration meters' id='depthOfPenetrationMeters' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Measured parameters' id='measuredParameters' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Instrument used' id='instrumentUsed' size="w-full"/>
                                </div>
                                <div>
                                    <Input type='date' isLabel={true} title='Survey date' id='surveyDate' size="w-full"/>
                                    <Input type='number' isLabel={true} title='Resolutions meters' id='resolutionsMeters' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Recovered properties of interest' id='recoveredPropertiesOfInterest' size="w-full"/>
                                    <Input type='text' isLabel={true} title='Potential targets' id='potentialTargets' size="w-full"/>
                                </div>
                            </div>
                            <Input type='textarea' isLabel={true} title='Geophysics comment' id='geophysicsComment' size="w-full"/>
                        </div>
                    </div>
                    <div className="lg:w-1/12"></div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6 pb-2 pr-4">
                <Link to="/dashboard" className="text-sm font-semibold leading-6">
                    Back
                </Link>
                <ButtonValidationForm isLoading={isLoading} title={"Create"} />
            </div>
        </form>
    );
};

export default CreateProjectForm;
