export const integrationSpec = {
    data: {
      date: {
        created_at: "2025-02-22",
        updated_at: "2025-02-22"
      },
      descriptions: {
        app_description: "Smart Travel Tracker helps travelers track locations, currency exchange, and time zones.",
        app_logo: "https://example.com/logo.png",
        app_name: "Smart Travel Tracker",
        app_url: "https://smarttraveltracker.com",
        background_color: "#007bff"
      },
      integration_category: "Monitoring & Logging",
      integration_type: "modifier",
      is_active: true,
      output: [
        {
          label: "Telex Notifications",
          value: true
        },
        {
          label: "Email Alerts",
          value: false
        }
      ],
      key_features: [
        "Real-time location tracking.",
        "Automatic currency exchange conversion.",
        "Time zone adjustment.",
        "Smart travel notifications."
      ],
      permissions: {
        monitoring_user: {
          always_online: true,
          display_name: "Performance Monitor"
        }
      },
      settings: [
        {
          label: "Gender",
          type: "radio",
          required: true,
          default: "Female",
          options: ["Male", "Female"]
        },
        {
          label: "Key",
          type: "text",
          required: true,
          default: "your_api_key_here"
        },
        {
          label: "Do you want to continue",
          type: "checkbox",
          required: true,
          default: true
        },
        {
          label: "Provide Speed",
          type: "number",
          required: true,
          default: 1000
        },
        {
          label: "Sensitivity Level",
          type: "dropdown",
          required: true,
          default: "Low",
          options: ["High", "Low"]
        },
        {
          label: "Alert Admin",
          type: "multi-checkbox",
          required: true,
          default: ["Super-Admin"],
          options: ["Super-Admin", "Admin", "Manager", "Developer"]
        }
      ],
      target_url: "https://smart-travel-tracker.onrender.com/telex/webhook"
    }
  };

  








