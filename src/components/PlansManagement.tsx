import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Eye, Star, Users } from 'lucide-react';

interface PlanData {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  subscribers: number;
  popular: boolean;
  status: 'active' | 'inactive';
  description: string;
}

const PlansManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const plans: PlanData[] = [
    {
      id: '1',
      name: 'Basic Monthly',
      price: 29,
      currency: '€',
      duration: 'month',
      features: [
        'Access to basic workouts',
        'Nutrition guidelines',
        'Progress tracking',
        'Email support'
      ],
      subscribers: 423,
      popular: false,
      status: 'active',
      description: 'Perfect for beginners starting their fitness journey'
    },
    {
      id: '2',
      name: 'Premium Monthly',
      price: 59,
      currency: '€',
      duration: 'month',
      features: [
        'All Basic features',
        'Premium workout library',
        'Personalized meal plans',
        'Live coaching sessions',
        'Priority support'
      ],
      subscribers: 756,
      popular: true,
      status: 'active',
      description: 'Most popular plan with comprehensive fitness guidance'
    },
    {
      id: '3',
      name: 'Premium Annual',
      price: 590,
      currency: '€',
      duration: 'year',
      features: [
        'All Premium Monthly features',
        '2 months free',
        'Exclusive content',
        'Personal trainer consultations',
        'Advanced analytics'
      ],
      subscribers: 234,
      popular: false,
      status: 'active',
      description: 'Best value for serious fitness enthusiasts'
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Plans Management</h1>
          <p className="text-gray-400">Create and manage your subscription plans</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Plans</p>
              <p className="text-2xl font-bold text-white">{plans.filter(p => p.status === 'active').length}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Subscribers</p>
              <p className="text-2xl font-bold text-white">{plans.reduce((sum, plan) => sum + plan.subscribers, 0)}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">€{(plans[0].price * plans[0].subscribers + plans[1].price * plans[1].subscribers).toLocaleString()}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Plan Value</p>
              <p className="text-2xl font-bold text-white">€{Math.round(plans.reduce((sum, plan) => sum + plan.price, 0) / plans.length)}</p>
            </div>
            <Package className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-gray-800 rounded-lg p-6 border-2 ${
            plan.popular ? 'border-red-500' : 'border-gray-700'
          } hover:border-red-500 transition-colors duration-200 relative`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-white">{plan.currency}{plan.price}</span>
                <span className="text-gray-400 ml-2">/{plan.duration}</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                {plan.subscribers} subscribers
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                plan.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {plan.status}
              </span>
              <div className="flex space-x-2">
                <button className="text-blue-400 hover:text-blue-300 p-2">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-yellow-400 hover:text-yellow-300 p-2">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              plan.popular 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}>
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-6">Create New Plan</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="e.g., Premium Monthly"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price
                  </label>
                  <div className="flex">
                    <select className="bg-gray-700 text-white px-3 py-2 rounded-l-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
                      <option value="€">€</option>
                      <option value="$">$</option>
                      <option value="£">£</option>
                    </select>
                    <input
                      type="number"
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-r-lg border-l-0 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                      placeholder="59"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
                  <option value="month">Monthly</option>
                  <option value="year">Annual</option>
                  <option value="week">Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  rows={3}
                  placeholder="Brief description of the plan..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  rows={5}
                  placeholder="Access to basic workouts&#10;Nutrition guidelines&#10;Progress tracking"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-300">Mark as popular</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-300">Active</span>
                </label>
              </div>
              <div className="flex space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansManagement;