import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0,
    },
    locations: [
    {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, 
      country: String,
      city: String
    }
  ]
}, { timestamps: true });

const urlModel = mongoose.model("Url", urlSchema);
export default urlModel;
