import mongoose from "mongoose";

export const Season = new mongoose.Schema({
    seasonNumber: { type: String, required: true },
    status: { type: String, required: true },
});

export const SeasonModel = mongoose.model('Season', Season);
