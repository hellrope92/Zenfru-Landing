"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CallData } from "@/types/call";
import CallDetailsModal from "../../components/CallDetailsModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [calls, setCalls] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCalls();
    }
  }, [status]);

  const fetchCalls = async () => {
    try {
      const response = await fetch("/api/calls");
      const data = await response.json();
      if (data.success) {
        setCalls(data.calls);
      }
    } catch (error) {
      console.error("Error fetching calls:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Calculate analytics
  const totalCalls = calls.length;
  const engagements = calls.filter(c => 
    c.analysis?.callSuccessful === "success"
  ).length;

  // Call outcomes - Booked, Engaged, Call Back
  const booked = calls.filter(c => c.callOutcome === "Booked").length;
  const engaged = calls.filter(c => c.callOutcome === "Engaged").length;
  const callBack = calls.filter(c => c.callOutcome === "Call Back").length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">AI Receptionist</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-2">
              <span>📅</span>
              <span>Today</span>
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Call Analytics</h2>
          <p className="text-gray-600">Overview of your AI receptionist performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversations Initiated</p>
                <p className="text-3xl font-bold text-gray-900">{totalCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Engagements</p>
                <p className="text-3xl font-bold text-gray-900">{engagements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call Outcomes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Call Outcomes</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Booked</span>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">{booked}</span>
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full min-w-[60px] text-center">
                    {totalCalls > 0 ? ((booked / totalCalls) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Engaged</span>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">{engaged}</span>
                  <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full min-w-[60px] text-center">
                    {totalCalls > 0 ? ((engaged / totalCalls) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Call Back</span>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">{callBack}</span>
                  <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full min-w-[60px] text-center">
                    {totalCalls > 0 ? ((callBack / totalCalls) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

        {/* Call Records Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Call Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Caller Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Caller Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Outcome
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calls.map((call) => (
                  <tr 
                    key={call._id}
                    onClick={() => setSelectedCall(call)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(call.metadata.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {call.callerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {call.callerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <span className={call.callType === 'outbound' ? 'text-green-600' : 'text-blue-600'}>
                          📞
                        </span>
                        <span>{call.callType === 'outbound' ? 'Outbound' : 'Inbound'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDuration(call.metadata.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                      {call.callAttempt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {call.callPurpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        call.analysis?.callSuccessful === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {call.analysis?.callSuccessful || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Call Details Modal */}
      {selectedCall && (
        <CallDetailsModal 
          call={selectedCall} 
          onClose={() => setSelectedCall(null)} 
        />
      )}
    </div>
  );
}
