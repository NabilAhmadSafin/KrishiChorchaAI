import { CropData } from "../../types";

export const riceData: CropData = {
  id: "rice",
  name: "Rice | ধান",
  icon: "🌾",
  diseases: [
    {
      id: "rice_blast",
      name: "Rice Blast | ধান ব্লাস্ট বা পাতা পচা",
      description: "A fungal disease causing lesions on leaves, stems, pods, and seeds. | একটি ছত্রাকজনিত রোগ যা পাতা, কান্ড এবং বীজে দাগ তৈরি করে।",
      symptoms: [
        "Diamond-shaped lesions on leaves | পাতায় হীরার আকৃতির দাগ",
        "Brown or grayish center in spots | দাগের কেন্দ্রে বাদামী বা ধূসর রঙ",
        "Lesions may enlarge and kill entire leaves | দাগ বড় হয়ে পুরো পাতা মেরে ফেলতে পারে",
        "Rotting starts at the neck of the panicle | শীষের গোড়ায় পচন শুরু হয়"
      ],
      treatment: [
        "Apply Tricyclazole or Propiconazole | ট্রাইসাইক্লাজোল বা প্রোপিকোনাজোল প্রয়োগ করুন",
        "Avoid excessive nitrogen fertilizer | অতিরিক্ত নাইট্রোজেন সার এড়িয়ে চলুন"
      ],
      prevention: [
        "Plant resistant varieties | প্রতিরোধী জাত রোপণ করুন",
        "Maintain proper plant spacing | গাছ রোপণে সঠিক দূরত্ব বজায় রাখুন",
        "Destroy infected crop residues | সংক্রামিত ফসলের অবশিষ্টাংশ ধ্বংস করুন"
      ],
      severity: "High | উচ্চ"
    },
    {
      id: "bacterial_leaf_blight",
      name: "Bacterial Leaf Blight | ব্যাকটেরিয়াল পাতা পোড়া",
      description: "Caused by bacteria, leads to yellowing and drying of leaves. | ব্যাকটেরিয়ার কারণে পাতা হলুদ ও শুকিয়ে যায়।",
      symptoms: [
        "Water-soaked lesions on leaf edges | পাতার প্রান্তে জল-ভেজা দাগ",
        "Lesions turn yellow to white as they expand | দাগ বড় হওয়ার সাথে সাথে সাদা-হলুদ হয়",
        "Milky or opaque dew drops on young lesions | নতুন দাগের উপর দুধের মতো শিশির বিন্দু"
      ],
      treatment: [
        "Apply Copper Oxychloride and Streptomycin | কপার অক্সিক্লোরাইড এবং স্ট্রেপটোমাইসিন প্রয়োগ করুন",
        "Drain the field, dry for a few days | কয়েক দিন মাঠ শুকিয়ে পানি বের করে দিন"
      ],
      prevention: [
        "Use disease-free seeds | রোগমুক্ত বীজ ব্যবহার করুন",
        "Ensure good drainage | ভালো পানি নিষ্কাশন ব্যবস্থা নিশ্চিত করুন"
      ],
      severity: "High | উচ্চ"
    },
    {
      id: "brown_spot",
      name: "Brown Spot | বাদামী দাগ রোগ",
      description: "Fungal disease causing many small oval spots. | ছত্রাক সৃষ্ট রোগ যা পাতায় ছোট ছোট ডিম্বাকৃতির দাগ তৈরি করে।",
      symptoms: [
        "Round to oval, dark brown lesions on leaves | পাতায় গোল বা ডিম্বাকার গা dark় বাদামী দাগ",
        "Yellow halo around the spots | দাগের চারপাশে হলুদ সীমানা",
        "Seeds may also be infected and discolored | বীজ সংক্রমিত এবং বিবর্ণ হতে পারে"
      ],
      treatment: [
        "Apply Mancozeb or Edifenphos | ম্যানকোজেব বা এডিফেনফোস প্রয়োগ করুন"
      ],
      prevention: [
        "Apply balanced fertilizers (Nitrogen, Phosphorus, Potassium) | সুষম সার প্রয়োগ করুন (নাইট্রোজেন, ফসফরাস, পটাশিয়াম)",
        "Treat seeds before planting | রোপণের আগে বীজ শোধন করুন"
      ],
      severity: "Medium | মাঝারি"
    },
    {
      id: "tungro",
      name: "Tungro Disease | টুংরো রোগ",
      description: "Viral disease transmitted by leafhoppers. | লিফহপার দ্বারা সংক্রামিত ভাইরাল রোগ।",
      symptoms: [
        "Stunted plant growth | গাছের বৃদ্ধি বাধাগ্রস্ত হয়",
        "Leaves turn yellow or orange from the tip | পাতা ডগা থেকে হলুদ বা কমলা হয়ে যায়",
        "Reduced tillering (fewer branches) | ডালপালা তৈরি হ্রাস পায়"
      ],
      treatment: [
        "No direct cure for the virus, control the vector (leafhoppers) | ভাইরাসের সরাসরি কোনো নিরাময় নেই, বাহক দমন করুন",
        "Apply insecticides like Imidacloprid to kill vectors | ইমিডাক্লোপ্রিডের মতো কীটনাশক প্রয়োগ করুন"
      ],
      prevention: [
        "Remove infected plants immediately | সংক্রামিত গাছগুলি অবিলম্বে সরিয়ে ফেলুন",
        "Adjust planting times to avoid leafhopper peak seasons | লিফহপারের বেশি থাকার সময় এড়িয়ে রোপণ করুন"
      ],
      severity: "High | উচ্চ"
    },
    {
      id: "sheath_blight",
      name: "Sheath Blight | খোল পোড়া রোগ",
      description: "Fungal disease affecting the lower parts of the plant. | কাণ্ডের নিচের অংশে আক্রমণ করা ছত্রাক রোগ।",
      symptoms: [
        "Oval greenish-gray spots on the leaf sheath | পাতার খোলে ডিম্বাকার সবুজাভ-ধূসর দাগ",
        "Spots enlarge and turn bleached with irregular brown borders | দাগ বড় হয়ে বাদামী সীমানাসহ সাদাটে হয়",
        "In severe cases, plants lodge (fall over) and die | মারাত্মক ক্ষেত্রে গাছ ঢলে পড়ে মারা যায়"
      ],
      treatment: [
        "Apply Validamycin, Propiconazole or Hexaconazole | ভ্যালিডামাইসিন, প্রোপিকোনাজোল বা হেক্সাকোনাজোল প্রয়োগ করুন"
      ],
      prevention: [
        "Avoid dense planting | ঘন রোপণ এড়িয়ে চলুন",
        "Avoid heavy nitrogen application | অতিরিক্ত নাইট্রোজেন প্রয়োগ এড়ান"
      ],
      severity: "Medium | মাঝারি"
    }
  ],
  questions: [
    {
      id: "q_rice_1",
      question: "What does the leaf damage look like? | পাতার ক্ষতের বর্ণনা দিন:",
      options: [
        { text: "Diamond-shaped spots with gray centers | ধূসর কেন্দ্রযুক্ত হীরার আকৃতির দাগ", points: { "rice_blast": 5 } },
        { text: "Yellowing from the tips/edges going downwards | ডগা/প্রান্ত থেকে নিচের দিকে হলুদ হয়ে যাওয়া", points: { "bacterial_leaf_blight": 5, "tungro": 2 } },
        { text: "Round or oval dark brown spots with a yellow halo | হলুদ সীমানাযুক্ত গোল বা ডিম্বাকার গা dark় বাদামী দাগ", points: { "brown_spot": 5 } },
        { text: "Greenish-gray oval spots near the water level/sheath | পানির স্তরের কাছে/খোলে সবুজাভ-ধূসর ডিম্বাকার দাগ", points: { "sheath_blight": 5 } },
        { text: "Orange-yellow tips and stunted growth | কমলা-হলুদ ডগা এবং বৃদ্ধি ব্যাহত", points: { "tungro": 5 } }
      ]
    },
    {
      id: "q_rice_2",
      question: "Which part of the plant is primarily affected? | গাছের কোন অংশ প্রধানত ক্ষতিগ্রস্ত হয়েছে?",
      options: [
        { text: "Only the leaves | শুধুমাত্র পাতা", points: { "brown_spot": 3, "bacterial_leaf_blight": 2 } },
        { text: "Neck of the panicle (where the grains start) is rotting | শীষের গোড়ায় পচন", points: { "rice_blast": 4 } },
        { text: "Lower stems and leaf sheaths | নিচের কাণ্ড এবং পাতার খোল", points: { "sheath_blight": 4 } },
        { text: "The entire plant looks stunted and discolored | পুরো গাছ ছোট এবং বিবর্ণ দেখাচ্ছে", points: { "tungro": 4 } }
      ]
    },
    {
      id: "q_rice_3",
      question: "Can you spot any insects or dew-like substance? | আপনি কি কোনো পোকামাকড় বা শিশিরের মতো পদার্থ দেখতে পাচ্ছেন?",
      optionsAreMultipleSelect: true,
      options: [
        { text: "Yes, small green or brown sap-sucking insects (leafhoppers) | হ্যাঁ, ছোট সবুজ বা বাদামী রস চোষক পোকা (লিফহপার)", points: { "tungro": 5 } },
        { text: "Milky, opaque droplets on the lesions early in the morning | সকালে দাগের উপর দুধের মতো, অস্বচ্ছ শিশির বিন্দু", points: { "bacterial_leaf_blight": 5 } },
        { text: "No insects or specific dew visible | কোনো পোকা বা বিশেষ শিশির দৃশ্যমান নয়", points: { "rice_blast": 1, "sheath_blight": 1, "brown_spot": 1 } }
      ]
    },
    {
      id: "q_rice_4",
      question: "What is your recent field management history? | আপনার ক্ষেতের সাম্প্রতিক ব্যবস্থাপনা কেমন ছিল?",
      options: [
        { text: "Applied high doses of Urea/Nitrogen | বেশি পরিমাণে ইউরিয়া/নাইট্রোজেন প্রয়োগ করেছি", points: { "rice_blast": 2, "sheath_blight": 2, "bacterial_leaf_blight": 2 } },
        { text: "Haven't applied much fertilizer recently | সম্প্রতি খুব বেশি সার দিইনি", points: { "brown_spot": 3 } },
        { text: "The field was deeply flooded for a long time | মাঠ দীর্ঘদিন গভীর পানিতে তলিয়ে ছিল", points: { "bacterial_leaf_blight": 2 } },
        { text: "None of the above | এর কোনটিই নয়", points: {} }
      ]
    },
    {
      id: "q_rice_5",
      question: "What is the recent weather condition like? | সম্প্রতি আবহাওয়া কেমন ছিল?",
      options: [
        { text: "High humidity and continuous rain | অত্যধিক আর্দ্রতা এবং একটানা বৃষ্টি", points: { "rice_blast": 3, "bacterial_leaf_blight": 3 } },
        { text: "Warm and very dry | উষ্ণ এবং খুব শুষ্ক", points: { "brown_spot": 3 } },
        { text: "Normal / No specific pattern | স্বাভাবিক / কোন নির্দিষ্ট প্যাটার্ন নেই", points: {} }
      ]
    },
    {
      id: "q_rice_6",
      question: "At what growth stage is the plant currently? | গাছ বর্তমানে কোন বৃদ্ধি পর্যায়ে আছে?",
      options: [
        { text: "Seedling or Tillering stage | চারা বা কুশি স্তর", points: { "tungro": 3, "bacterial_leaf_blight": 2 } },
        { text: "Flowering or Booting stage | ফুল আসা বা থোড় স্তর", points: { "rice_blast": 3, "sheath_blight": 3 } },
        { text: "Maturity stage | পরিপক্কতার পর্যায়", points: { "brown_spot": 2 } }
      ]
    }
  ]
};
