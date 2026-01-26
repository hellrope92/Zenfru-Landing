const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://admin:Dentalai25@zenfru.3cejkij.mongodb.net/?retryWrites=true&w=majority&appName=Zenfru";

async function insertSampleCall() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = client.db("demo_dashboard");
    
    // Get the first user to link the call to
    const user = await db.collection('users').findOne({});
    
    if (!user) {
      console.error('No user found in database. Please create a user first.');
      await client.close();
      return;
    }

    console.log('Linking call to user:', user.email);

    const sampleCallData = {
      conversationId: "conv_sample_123456",
      agentId: "agent_1501kf530v6dezabc21qb0a1cj89",
      userId: user._id.toString(),
      elevenLabsUserId: "user_demo_001",
      status: "done",
      callerName: "John Smith",
      callerNumber: "555-123-4567",
      callType: "inbound",
      callAttempt: 1,
      callPurpose: "Cleaning",
      transcript: [
        {
          role: "agent",
          message: "Hello! Thank you for calling Zenfru Dental. How can I help you today?",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 0,
          conversation_turn_metrics: null
        },
        {
          role: "user",
          message: "Hi, I'd like to schedule a dental cleaning appointment.",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 3,
          conversation_turn_metrics: null
        },
        {
          role: "agent",
          message: "I'd be happy to help you schedule a cleaning appointment. Can you please provide me with your preferred date and time?",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 8,
          conversation_turn_metrics: {
            convai_llm_service_ttfb: {
              elapsed_time: 0.32
            },
            convai_llm_service_ttf_sentence: {
              elapsed_time: 0.48
            }
          }
        },
        {
          role: "user",
          message: "How about next Tuesday at 2 PM?",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 14,
          conversation_turn_metrics: null
        },
        {
          role: "agent",
          message: "Perfect! I've scheduled your dental cleaning for next Tuesday at 2 PM. You'll receive a confirmation email shortly. Is there anything else I can help you with?",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 18,
          conversation_turn_metrics: {
            convai_llm_service_ttfb: {
              elapsed_time: 0.28
            },
            convai_llm_service_ttf_sentence: {
              elapsed_time: 0.45
            }
          }
        },
        {
          role: "user",
          message: "No, that's all. Thank you!",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 26,
          conversation_turn_metrics: null
        },
        {
          role: "agent",
          message: "You're welcome! Have a great day and we'll see you next Tuesday!",
          tool_calls: null,
          tool_results: null,
          feedback: null,
          time_in_call_secs: 29,
          conversation_turn_metrics: {
            convai_llm_service_ttfb: {
              elapsed_time: 0.25
            },
            convai_llm_service_ttf_sentence: {
              elapsed_time: 0.42
            }
          }
        }
      ],
      metadata: {
        startTime: new Date(Date.now() - 3600000),
        duration: 32,
        cost: 420,
        terminationReason: "",
        feedback: {
          overall_score: null,
          likes: 1,
          dislikes: 0
        }
      },
      analysis: {
        callSuccessful: "success",
        summary: "The conversation was a successful appointment booking call. The patient called to schedule a dental cleaning and provided their preferred time. The AI agent efficiently scheduled the appointment for next Tuesday at 2 PM and confirmed the details. The interaction was professional, friendly, and completed the patient's request successfully.",
        evaluationResults: {},
        dataCollectionResults: {}
      },
      conversationInitiationData: {
        conversation_config_override: {
          agent: {
            prompt: null,
            first_message: null,
            language: "en"
          },
          tts: {
            voice_id: null
          }
        },
        custom_llm_extra_body: {},
        dynamic_variables: {
          user_name: "John"
        }
      },
      eventTimestamp: new Date(),
      createdAt: new Date(),
      hasAudio: false,
      audioUrl: null
    };
    
    const result = await db.collection('calls').insertOne(sampleCallData);

    console.log('Sample call data inserted successfully!');
    console.log('Call ID:', result.insertedId);
    console.log('Conversation ID:', sampleCallData.conversationId);
    console.log('\nCall Details:');
    console.log('- Duration:', sampleCallData.metadata.duration, 'seconds');
    console.log('- Status:', sampleCallData.analysis.callSuccessful);
    console.log('- Summary:', sampleCallData.analysis.summary);

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

insertSampleCall();
