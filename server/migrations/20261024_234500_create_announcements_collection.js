/**
 * Migration: 20261024_234500_create_announcements_collection.js
 * Database Engine: MongoDB Shell (mongosh)
 * 
 * Direct Execution:
 *   mongosh "<MONGO_URI>" 20261024_234500_create_announcements_collection.js
 *   Or copy-paste queries directly into mongosh, MongoDB Compass, or Atlas Web Shell.
 */

// 1. Create collection with JSON Schema Validator
try {
  db.createCollection("announcements", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "description", "expiryDate"],
        properties: {
          title: {
            bsonType: "string",
            description: "Announcement title - must be a string and is required"
          },
          description: {
            bsonType: "string",
            description: "Announcement description - must be a string and is required"
          },
          type: {
            enum: ["regular", "advisory", "critical"],
            description: "Announcement type - must be regular, advisory, or critical"
          },
          targetType: {
            enum: ["all", "individual"],
            description: "Target audience - must be all or individual"
          },
          targetPatientId: {
            bsonType: ["objectId", "null"],
            description: "Reference to User ObjectId if targetType is individual"
          },
          startDate: {
            bsonType: "date",
            description: "Date from which announcement is visible"
          },
          expiryDate: {
            bsonType: "date",
            description: "Expiry date after which announcement is hidden - required"
          },
          isActive: {
            bsonType: "bool",
            description: "Active toggle boolean"
          },
          createdAt: {
            bsonType: "date",
            description: "Document creation timestamp"
          },
          updatedAt: {
            bsonType: "date",
            description: "Document update timestamp"
          }
        }
      }
    },
    validationLevel: "moderate",
    validationAction: "warn"
  });
  print("Collection 'announcements' created with schema validator.");
} catch (e) {
  // If collection already exists, apply/update schema validator
  db.runCommand({
    collMod: "announcements",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "description", "expiryDate"],
        properties: {
          title: {
            bsonType: "string",
            description: "Announcement title - must be a string and is required"
          },
          description: {
            bsonType: "string",
            description: "Announcement description - must be a string and is required"
          },
          type: {
            enum: ["regular", "advisory", "critical"],
            description: "Announcement type - must be regular, advisory, or critical"
          },
          targetType: {
            enum: ["all", "individual"],
            description: "Target audience - must be all or individual"
          },
          targetPatientId: {
            bsonType: ["objectId", "null"],
            description: "Reference to User ObjectId if targetType is individual"
          },
          startDate: {
            bsonType: "date",
            description: "Date from which announcement is visible"
          },
          expiryDate: {
            bsonType: "date",
            description: "Expiry date after which announcement is hidden - required"
          },
          isActive: {
            bsonType: "bool",
            description: "Active toggle boolean"
          },
          createdAt: {
            bsonType: "date"
          },
          updatedAt: {
            bsonType: "date"
          }
        }
      }
    },
    validationLevel: "moderate",
    validationAction: "warn"
  });
  print("Collection 'announcements' already exists. Updated schema validator.");
}

// 2. Create Indexes
db.announcements.createIndex({ expiryDate: 1 }, { name: "idx_expiryDate" });
db.announcements.createIndex({ isActive: 1 }, { name: "idx_isActive" });
db.announcements.createIndex({ targetType: 1 }, { name: "idx_targetType" });
db.announcements.createIndex(
  {
    isActive: 1,
    startDate: 1,
    expiryDate: 1,
    targetType: 1,
    targetPatientId: 1
  },
  { name: "idx_active_lookup" }
);
print("Indexes created successfully on 'announcements'.");

// 3. Initial Announcement Insert (insertOne)
db.announcements.insertOne({
  title: "Specialized Spine & Posture Assessment Clinic",
  description: "Free posture evaluation and ergonomic spine alignment consultations are available every Saturday morning with Dr. Neha Sharma (PT). Advance booking recommended.",
  type: "regular",
  targetType: "all",
  targetPatientId: null,
  startDate: new Date(),
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.announcements.insertOne({
  title: "Winter Mobility & Joint Care Advisory",
  description: "Patients with cervical spondylosis or knee osteoarthritis should maintain 15 minutes of warm water fomentation before morning rehabilitation stretches.",
  type: "advisory",
  targetType: "all",
  targetPatientId: null,
  startDate: new Date(),
  expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Initial announcements inserted successfully via insertOne.");
