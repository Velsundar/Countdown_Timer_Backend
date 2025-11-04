import Event from "../models/Event.js";

const DEFAULT_EVENTS = {
  engagement: {
    name: "engagement",
    date: new Date("2025-12-07T18:00:00+05:30"),
    description: "Our Engagement Day 💍",
  },
  marriage: {
    name: "marriage",
    date: new Date("2026-04-06T11:00:00+05:30"),
    description: "Our Wedding Day 💒",
  },
};

const calculateRemainingTime = (eventDate) => {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    const timeSince = Math.abs(diff);
    
    const days = Math.floor(timeSince / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeSince / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeSince / (1000 * 60)) % 60);
    const seconds = Math.floor((timeSince / 1000) % 60);

    return { days, hours, minutes, seconds, isOver: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isOver: false };
};

export const getCountdown = async (req, res) => {
  try {
    const { event } = req.params;
    if (!["engagement", "marriage"].includes(event)) {
      return res.status(400).json({ success: false, error: "Invalid event name." });
    }
    let eventData = await Event.findOne({ name: event });

    if (!eventData) {
      eventData = DEFAULT_EVENTS[event];
    }

    const remaining = calculateRemainingTime(new Date(eventData.date));

    res.status(200).json({
      success: true,
      event: eventData.name,
      description: eventData.description,
      date: eventData.date,
      remaining,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error fetching countdown." });
  }
};

export const setEventDate = async (req, res) => {
  try {
    const { name, date, description } = req.body;

    if (!["engagement", "marriage"].includes(name)) {
      return res.status(400).json({ success: false, error: "Invalid event name." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ success: false, error: "Invalid date format." });
    }

    const event = await Event.findOneAndUpdate(
      { name },
      { date: parsedDate, description },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Event updated successfully.", data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error updating event." });
  }
};
