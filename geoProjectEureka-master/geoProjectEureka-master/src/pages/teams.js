'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Loader2, Plus, X } from 'lucide-react'
import useAuthentication from '../hooks/useAuthentication'
import Footer from '../components/Footer/footer'
import Header from '../components/Header/header'

export default function TeamMemberPage() {
  const { getUserInfosFromSessionStorage } = useAuthentication()
  const userInfos = getUserInfosFromSessionStorage()
  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    profilePicture: '',
    description: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      facebook: ''
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const buttonRef = useRef(null)
  const popoverRef = useRef(null)

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsPopoverOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:3001/api/team-members')
      setTeamMembers(response.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch team members. Please try again.')
      console.error('Error fetching team members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewMember((prev) => {
      if (name.startsWith('socialLinks.')) {
        const [_, platform] = name.split('.')
        return {
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [platform]: value
          }
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewMember((prev) => ({ ...prev, profilePicture: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(newMember).forEach(([key, value]) => {
      if (key === 'socialLinks') {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    })
    try {
      await axios.post('http://localhost:3001/api/team-members', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setNewMember({
        name: '',
        role: '',
        email: '',
        profilePicture: '',
        description: '',
        socialLinks: { linkedin: '', github: '', twitter: '', facebook: '' }
      })
      setIsPopoverOpen(false)
      fetchTeamMembers()
    } catch (err) {
      setError('Failed to add team member. Please try again.')
      console.error('Error adding team member:', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header connected={!!userInfos} role={userInfos?.role} />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Our Team</h1>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
            >
              <Plus className="mr-2" />
              Add New Team Member
            </button>

            {isPopoverOpen && (
              <div
                ref={popoverRef}
                className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-6 w-96 z-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Team Member</h2>
                  <button
                    onClick={() => setIsPopoverOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={newMember.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="role"
                      value={newMember.role}
                      onChange={handleInputChange}
                      placeholder="Role"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={newMember.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <textarea
                      name="description"
                      value={newMember.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      name="socialLinks.linkedin"
                      value={newMember.socialLinks.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn URL"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      name="socialLinks.github"
                      value={newMember.socialLinks.github}
                      onChange={handleInputChange}
                      placeholder="GitHub URL"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      name="socialLinks.twitter"
                      value={newMember.socialLinks.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter URL"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      name="socialLinks.facebook"
                      value={newMember.socialLinks.facebook}
                      onChange={handleInputChange}
                      placeholder="Facebook URL"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Team Member
                  </button>
                </form>
              </div>
            )}
          </div>
      

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">The Ultimate Team</h2>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading team members...</span>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white shadow-md rounded-lg p-6">
                  <img
                    src={member.profilePicture}
                    alt={`${member.name}'s profile`}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-center">{member.name}</h3>
                  <p className="text-gray-600 text-center mb-2">{member.role}</p>
                  <p className="text-gray-500 text-center mb-4">{member.email}</p>
                  <p className="text-gray-700 mb-4 text-center">{member.description}</p>
                  <div className="flex justify-center space-x-4">
                    {Object.entries(member.socialLinks).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}