import Transaction from "../models/Transaction.js";
import Balance from "../models/Balance.js";
import User from "../models/User.js";
import moment from "moment-timezone";
import { sendWhatsAppMessage } from "../config/whatsappHelper.js";


export const addTransaction = async (req, res) => {
  try {
    const { userId, amount, type, title, description, timeAndDate, adminId } = req.body;

    // Validate required fields
    if (!userId || !amount || !type || !title || !timeAndDate || !adminId) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // Convert `timeAndDate` to ISO format (if not already in ISO)
    const formattedDate = moment(timeAndDate, "YYYY-MM-DDTHH:mm")
      .tz("Asia/Kolkata")
      .toISOString(); // Converts to correct UTC format for MongoDB

    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      title,
      description,
      timeAndDate: formattedDate, // Use formatted date
      adminId,
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully", transaction: savedTransaction });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
export const addTransaction = async (req, res) => {
  try {
    const { userId, amount, type, title, description, timeAndDate, adminId } =
      req.body;

    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      title,
      description,
      timeAndDate,
      adminId,
    });


    await newTransaction.save();

    // **Remaining Balance शोधा**
    const userBalance = await Balance.findOne({ userId });
    if (!userBalance) {
      return res.status(404).json({ error: "User balance not found" });
    }

    // **User Info मिळवा**
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const remainingBalance = userBalance.balance;

    // **WhatsApp वर मेसेज पाठवा**
    const message = `🔔 *Transaction Alert* 🔔
    Hello ${user.name}, 
    Your transaction is successful!

📌 *Title:* ${title}
💸 *Amount:* ₹${amount}
🔄 *Type:* ${type.toUpperCase()}
💰 *Remaining Balance:* ₹${remainingBalance}

    
    Thank you for using our service! 😊`;

    await sendWhatsAppMessage(user.phone, message);

    res
      .status(201)
      .json({
        message: "Transaction added & WhatsApp message sent successfully",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



import axios from 'axios';

export const addTransaction = async (req, res) => {
  try {
    const { userId, amount, type, title, description, timeAndDate, adminId } = req.body;

    // **Transaction Save करा**
    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      title,
      description,
      timeAndDate,
      adminId,
    });

    await newTransaction.save();

    // **Remaining Balance शोधा**
    const userBalance = await Balance.findOne({ userId });
    if (!userBalance) {
      return res.status(404).json({ error: "User balance not found" });
    }

    // **User Info मिळवा**
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const remainingBalance = userBalance.balance;

    // **SMS पाठवा**
    const message = `🔔 Transaction Alert 🔔
Hello ${user.name}, 
Your transaction is successful!

📌 Title: ${title}
💸 Amount: ₹${amount}
🔄 Type: ${type.toUpperCase()}
💰 Remaining Balance: ₹${remainingBalance}

Thank you for using our service! 😊`;

    const apiKey = "b28e933e9480b3cfae7a09400e92ae3df1cd280164438831"; // स्वतःची API Key वापर
    const smsUrl = `https://api.smsmobileapi.com/sendsms/?recipients=${user.phone}&message=${encodeURIComponent(message)}&apikey=${apiKey}`;

    await axios.get(smsUrl);

    res.status(201).json({ message: "Transaction added & SMS sent successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

*/

import axios from 'axios';

export const addTransactionbysms = async (req, res) => {
  try {
    const { userId, amount, type, title, description, timeAndDate, adminId } = req.body;

    console.log("📥 Received Transaction Data:", req.body);

    // **Transaction Save करा**
    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      title,
      description,
      timeAndDate,
      adminId,
    });

    await newTransaction.save();
    console.log("✅ Transaction Saved Successfully");

    // **Remaining Balance शोधा**
    const userBalance = await Balance.findOne({ userId });
    if (!userBalance) {
      console.error("❌ User balance not found");
      return res.status(404).json({ error: "User balance not found" });
    }

    // **User Info मिळवा**
    const user = await User.findOne({ uid: userId });
    if (!user) {
      console.error("❌ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const remainingBalance = userBalance.balance;
    console.log(`✅ User Found: ${user.name} | Remaining Balance: ${remainingBalance}`);

    // **SMS पाठवा (Fast2SMS API)**
    const message = `🔔 Transaction Alert 🔔
Hello ${user.name}, 
Your transaction is successful!

📌 Title: ${title}
💸 Amount: ₹${amount}
🔄 Type: ${type.toUpperCase()}
💰 Remaining Balance: ₹${remainingBalance}

Thank you for using our service! 😊`;

    const fast2smsApiKey = "GCHtKkpyXJ0W4FmWBkR0DGFnFqJeXbE48lvCFfdzmxLb5wsgUbWZcH9KUFd8"; // 🔑 तुझी API Key टाक

    const smsOptions = {
      method: "POST",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        authorization: fast2smsApiKey,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        route: "q", // "q" म्हणजे Transactional Route
        message: message,
        language: "english",
        flash: 0,
        numbers: user.phone, // 👈 User चा Mobile Number
      }),
    };

    console.log("📨 Sending SMS to:", user.phone);
    console.log("🛠️ Sending Headers:", smsOptions.headers);

    // **SMS पाठवायचा प्रयत्न करा**
    try {
      const response = await axios(smsOptions);
      console.log("✅ SMS Sent Successfully:", response.data);
    } catch (smsError) {
      console.error("❌ SMS Sending Failed:", smsError.response?.data || smsError.message);
      return res.status(500).json({ error: "SMS sending failed" });
    }

    res.status(201).json({ message: "Transaction added & SMS sent successfully" });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};





/*

import axios from 'axios';


export const addTransactionbysms  = async (req, res) => {
  try {
    const { userId, amount, type, title, description, timeAndDate, adminId } = req.body;

    console.log("📌 Received Transaction Request:", req.body);

    // **Transaction तयार करा**
    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      title,
      description,
      timeAndDate,
      adminId,
    });

    // **Remaining Balance शोधा**
    const userBalance = await Balance.findOne({ userId });
    if (!userBalance) {
      console.error("❌ User balance not found for userId:", userId);
      return res.status(404).json({ error: "User balance not found" });
    }

    // **User Info मिळवा**
    const user = await User.findOne({ uid: userId });
    if (!user) {
      console.error("❌ User not found for userId:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const remainingBalance = userBalance.balance;
    console.log("✅ User Found:", user.name, "| Remaining Balance:", remainingBalance);

    // **Traccar Cloud SMS API Data तयार करा**
    const message = `🔔 Transaction Alert 🔔
Hello ${user.name}, 
Your transaction is successful!

📌 Title: ${title}
💸 Amount: ₹${amount}
🔄 Type: ${type.toUpperCase()}
💰 Remaining Balance: ₹${remainingBalance}

Thank you for using our service! 😊`;

    const smsData = {
      to: `+91${user.phone}`,  // **Ensure country code is included**
      message: message
    };

    console.log("📨 Sending SMS to:", smsData.to);

    // **Traccar Cloud API URL आणि Token**
    const cloudApiUrl = "https://traccar.org/sms/";
    const apiToken = "c6n53OAeSsCezgYpGEyxFk:APA91bGzfhx5ta3u1PgCZ-kLo98lPCaMlNWVYBwxNgXDKzQ7ghd-rt6zys2Tnfjqm6V098nffiAqttBop0O0_Uy0XFsnoQD8TscxLiVjVvghRP9B8oJZdbs";  // **तुझा Cloud API Token टाक**

    // **Cloud API वर SMS पाठवा**
    const smsResponse = await axios.post(cloudApiUrl, smsData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`,  // **Bearer Token जोडला**
      },
    });

    console.log("✅ SMS Sent! Response:", smsResponse.data);

    // **Transaction सेव्ह करा फक्त SMS पाठवल्यावर**
    await newTransaction.save();
    console.log("💾 Transaction Saved Successfully!");

    res.status(201).json({ message: "Transaction added & SMS sent successfully" });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

*/

// Get all transactions for the logged-in admin
export const getTransactionsByAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const transactions = await Transaction.find({ adminId });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewBalance = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const transactions = await Balance.find({ adminId });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
