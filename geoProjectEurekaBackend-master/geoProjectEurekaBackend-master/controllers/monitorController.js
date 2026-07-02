// controllers/monitorController.js
// =============================================================================
// Live Sensor Monitor — append-or-create endpoint
//
// Each incoming sensor reading is upserted into the day's project:
//   - If today's project (isLiveMonitor=true, dayKey=YYYY-MM-DD) exists,
//     find the device entry in sensorDevices[] and push a reading into it.
//   - If the device hasn't reported today yet, add a new device entry.
//   - If today's project doesn't exist at all, create it (one-time per day).
//
// All sensor readings for a given day end up in ONE project, with per-device
// tables inside it. New devices automatically register themselves on first
// reading.
// =============================================================================

const Data = require('../models/dataModel');

const appendSensorReading = async (req, res) => {
    try {
        const body = req.body || {};

        // ---------- validate ----------
        if (!body.userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required (the MongoDB ObjectId of the user '
                    + 'that should own the daily live-monitor project)',
            });
        }
        if (!body.device_id) {
            return res.status(400).json({
                success: false,
                error: 'device_id is required (e.g., "ESP32-01")',
            });
        }

        // ---------- determine which day this reading belongs to ----------
        const ts = body.timestamp ? new Date(body.timestamp) : new Date();
        if (isNaN(ts.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'timestamp is not a valid date',
            });
        }
        // Day key in UTC so all sensors agree on what "today" is.
        // Format: YYYY-MM-DD
        const dayKey = ts.toISOString().slice(0, 10);

        // ---------- the new reading we're adding ----------
        const reading = { timestamp: ts };
        if (body.temperature !== undefined && body.temperature !== null) {
            reading.temperature = Number(body.temperature);
        }
        if (body.humidity !== undefined && body.humidity !== null) {
            reading.humidity = Number(body.humidity);
        }

        // ---------- find OR create today's live-monitor project ----------
        let project = await Data.findOne({
            isLiveMonitor: true,
            dayKey: dayKey,
        });

        if (!project) {
            // First reading of the day → create the day's project
            project = new Data({
                title: `Sensor-Readings-${dayKey}`,
                location: body.location || 'IoT live monitor',
                sampleType: 'Live sensor stream',
                collectionDate: ts,
                geochemistryComment:
                    `Live IoT sensor readings — auto-aggregated by day. `
                    + `New devices register automatically on first reading.`,
                instrumentUsed: 'ESP32 / IoT sensors',
                method: 'IoT continuous monitoring',
                userId: body.userId,
                author: 'LIVE-MONITOR',
                isLiveMonitor: true,
                dayKey: dayKey,
                sensorDevices: [],
            });
        }

        // ---------- find OR create the device's entry ----------
        let device = project.sensorDevices.find(d => d.device_id === body.device_id);

        if (!device) {
            device = {
                device_id: body.device_id,
                location:  body.location || '',
                first_seen: ts,
                last_seen:  ts,
                readings:  [],
            };
            project.sensorDevices.push(device);
            // re-grab the pushed copy so we mutate the doc, not the local var
            device = project.sensorDevices[project.sensorDevices.length - 1];
        } else {
            // Update last_seen + location (in case it changed)
            device.last_seen = ts;
            if (body.location) device.location = body.location;
        }

        // ---------- append the reading ----------
        device.readings.push(reading);

        await project.save();

        console.log(`[live-monitor] day=${dayKey} device=${body.device_id} `
                  + `reading appended (${device.readings.length} total for device)`);

        return res.status(200).json({
            success: true,
            dataId: project.dataId,
            id: project._id,
            title: project.title,
            dayKey,
            device_id: body.device_id,
            n_readings_for_device: device.readings.length,
            n_devices_today: project.sensorDevices.length,
        });
    } catch (err) {
        console.error('[live-monitor] error:', err.message);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

module.exports = { appendSensorReading };
