import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useGetProject from "../hooks/data/get/useGetProjects";
import Footer from "../components/Footer/footer";
import Carousel from "../components/Carousel/carousel";
import axios from "axios";

const DetailsPage = () => {
    const location = useLocation();
    const { itemId, mediaFiles } = location.state || {};
    const { data, isLoading, error } = useGetProject(itemId);
    const navigate = useNavigate();

    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadedImages, setLoadedImages] = useState([]);

    useEffect(() => {
        const loadImages = async () => {
            if (mediaFiles && mediaFiles.length > 0) {
                const images = await Promise.all(
                    mediaFiles.map(async (url, index) => {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        return new File([blob], `image${index}.jpg`, { type: blob.type });
                    })
                );
                setLoadedImages(images);
            }
        };
        loadImages();
    }, [mediaFiles]);

    const handleCancel = () => {
        navigate("/dashboard");
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const base64Images = await Promise.all(
                loadedImages.map((mediaFile) => convertToBase64(mediaFile))
            );

            const formData = new FormData();
            base64Images.forEach((base64Image) => formData.append("files", base64Image));

            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Error during image analysis:", error);
            setAnalysisResult([{ error: "Failed to analyze images" }]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const convertToBase64 = (mediaFile) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(mediaFile);
            fileReader.onload = () => {
                const base64Data = fileReader.result.split(",")[1];
                resolve(base64Data);
            };
            fileReader.onerror = (error) => reject(error);
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No data available</div>;

    return (
        <main className="bg-gray-100 min-h-screen p-6">
            <h3 className="text-2xl font-bold text-blue-600 flex items-center justify-center mb-2">
                Title: {data.title}
            </h3>
            <h2 className="text-xl font-normal text-black-800 flex items-center justify-center mb-4">
                Date: {data.date}
            </h2>

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                    <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
                        <h4 className="text-xl font-medium text-black-800 flex items-center justify-center mb-4">Media</h4>
                        <Carousel mediaFiles={mediaFiles} />
                        <button
                            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || loadedImages.length === 0}
                        >
                            {isAnalyzing ? "Analyzing..." : "Analyze"}
                        </button>
                    </div>

                    {analysisResult && (
                        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
                            <h4 className="text-xl font-medium text-black-800 flex items-center justify-center mb-4">Analysis Result</h4>
                            {analysisResult.error ? (
                                <p className="text-red-500">{analysisResult.error}</p>
                            ) : (
                                <>
                                    {analysisResult.map((result, index) => (
                                        <div key={index} className="mb-4">
                                            <h5 className="font-semibold">Image {index + 1}: {result.filename}</h5>
                                            <p className="text-gray-700">
                                                <strong>Prediction:</strong> {result.prediction}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Confidence:</strong> {result.confidence ? result.confidence.toFixed(2) : 'N/A'}
                                            </p>
                                            <div>
                                                <strong>Explanations:</strong>
                                                <ul>
                                                    {result.explanations && result.explanations.map((exp, expIndex) => (
                                                        <li key={expIndex} className="text-gray-600">{exp}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-xl font-medium text-black-800 flex items-center justify-center mb-4">General</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <p><span className="font-semibold">Location:</span> {data.datas.location}</p>
                        <p><span className="font-semibold">Sample type:</span> {data.datas.sampleType}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-xl font-medium text-black-800 flex items-center justify-center mb-4">Geochemistry</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <p><span className="font-semibold">Depth:</span> {data.datas.depth}</p>
                        <p><span className="font-semibold">Temperature:</span> {data.datas.temperature}</p>
                        <p><span className="font-semibold">pH:</span> {data.datas.pH}</p>
                        <p><span className="font-semibold">Electrical conductivity:</span> {data.datas.electricalConductivity}</p>
                    </div>
                    <p className="mt-4"><span className="font-semibold">Geochemistry comment:</span><br />{data.geochemistry}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-xl font-medium text-black-800 flex items-center justify-center mb-4">Geology</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <p><span className="font-semibold">Lithology:</span> {data.datas.lithology}</p>
                        <p><span className="font-semibold">Alteration:</span> {data.datas.alteration}</p>
                        <p><span className="font-semibold">Mineralogy:</span> {data.datas.mineralogy}</p>
                        <p><span className="font-semibold">Texture:</span> {data.datas.texture}</p>
                        <p><span className="font-semibold">Hydrothermal features:</span> {data.datas.hydrothermalFeatures}</p>
                        <p><span className="font-semibold">Structure:</span> {data.datas.structure}</p>
                    </div>
                    <p className="mt-4"><span className="font-semibold">Geology comment:</span><br />{data.geology}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-xl font-medium text-black-800 flex items-center justify-center mb-4">Geophysics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <p><span className="font-semibold">Method:</span> {data.datas.method}</p>
                        <p><span className="font-semibold">Survey date:</span> {data.datas.surveyDate}</p>
                        <p><span className="font-semibold">Depth of penetration meters:</span> {data.datas.depthOfPenetrationMeters}</p>
                        <p><span className="font-semibold">Resolutions meters:</span> {data.datas.resolutionsMeters}</p>
                        <p><span className="font-semibold">Measured parameters:</span> {data.datas.measuredParameters}</p>
                        <p><span className="font-semibold">Recovered properties of interest:</span> {data.datas.recoveredPropertiesOfInterest}</p>
                    </div>
                    <p className="mt-4"><span className="font-semibold">Geophysics comment:</span><br />{data.geophysics}</p>
                </div>

                <button
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>

            <Footer />
        </main>
    );
};

export default DetailsPage;
