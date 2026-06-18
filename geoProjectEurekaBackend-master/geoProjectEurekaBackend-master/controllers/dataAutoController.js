// controllers/dataAutoController.js
// =============================================================================
// Auto-create endpoint for the LARGER-Africa data project system.
//
// This controller accepts JSON payloads from automation services (e.g., the
// GitHub ingestion script, PLC sensor gateway, etc.) and creates project
// records with the SAME schema as the manual /add endpoint.
//
// Key differences from /add:
//   - Auth: x-api-key header instead of JWT (service-to-service, not browser).
//   - The `author` field is used as the source tag (e.g., "GitHub:file.json",
//     "PLC-Olkaria", "GEE-Pipeline") so auto-projects are clearly identified
//     in the dashboard.
//   - userId comes from the request body so any registered user can be
//     designated as the owner (typically a dedicated "Automation" user).
//   - All fields are optional except title — partial payloads are accepted,
//     missing fields stay empty and can be filled in later via the form.
// =============================================================================

const Data = require('../models/dataModel');

const addDataAuto = async (req, res) => {
    try {
        const body = req.body || {};

        // -----------------------------------------------------------------
        // Validate the minimum payload
        // -----------------------------------------------------------------
        if (!body.userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required (the MongoDB ObjectId of the user '
                    + 'that should own this auto-created project)',
            });
        }

        // -----------------------------------------------------------------
        // Build the project title
        // If the caller provided one, use it. Otherwise generate something
        // descriptive: "{author}-{location}-{ISO timestamp}"
        // -----------------------------------------------------------------
        const author = body.author || 'AUTO';
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const title = body.title
            || `${author}-${body.location || 'site'}-${ts}`;

        // -----------------------------------------------------------------
        // Build the new project document
        // (every field is taken straight from the body; missing → undefined)
        // -----------------------------------------------------------------
        const newData = new Data({
            title,
            imagesVideos: Array.isArray(body.imagesVideos) ? body.imagesVideos : [],
            location: body.location,
            sampleType: body.sampleType,
            collectionDate: body.collectionDate
                ? new Date(body.collectionDate)
                : new Date(),

            // Geochemistry
            depth: body.depth,
            temperature: body.temperature,
            pH: body.pH,
            electricalConductivity: body.electricalConductivity,
            geochemistryComment: body.geochemistryComment,

            // Geology
            lithology: body.lithology,
            alteration: body.alteration,
            mineralogy: body.mineralogy,
            geochimicalAnalysis: body.geochimicalAnalysis,
            texture: body.texture,
            hydrothermalFeatures: body.hydrothermalFeatures,
            structure: body.structure,
            geologyComment: body.geologyComment,

            // Geophysics
            method: body.method,
            surveyDate: body.surveyDate ? new Date(body.surveyDate) : undefined,
            depthOfPenetrationMeters: body.depthOfPenetrationMeters,
            resolutionsMeters: body.resolutionsMeters,
            measuredParameters: body.measuredParameters,
            recoveredPropertiesOfInterest: body.recoveredPropertiesOfInterest,
            instrumentUsed: body.instrumentUsed,
            potentialTargets: body.potentialTargets,
            geophysicsComment: body.geophysicsComment,

            // Ownership and tagging
            userId: body.userId,
            author,
        });

        await newData.save();

        console.log(`[auto-create] dataId=${newData.dataId} title="${title}" `
                  + `author="${author}"`);

        return res.status(201).json({
            success: true,
            dataId: newData.dataId,
            id: newData._id,
            title: newData.title,
            author: newData.author,
            message: `Auto-created project #${newData.dataId}: ${newData.title}`,
        });
    } catch (err) {
        console.error('[auto-create] error:', err.message);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

module.exports = { addDataAuto };
