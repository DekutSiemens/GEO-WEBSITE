import React, { useState } from 'react';
import wgc2026Image from '../../assets/images/wgc-2026.png';
import strategyWorkImage from '../../assets/images/strategy-workshop.png';
import geothermal2Image from '../../assets/images/geothermal2.png';

export default function NewsroomHeroSection() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const newsItems = [
    {
      id: 1,
      image: wgc2026Image,
      title: 'WGC 2026',
      subtitle: 'Eavor - Innovation Category',
      content: `
        The Hague, 28 June 2024 – The International Geothermal Association a leading global organization dedicated to advance geothermal energy worldwide is proud to announce the election of its new leadership team. The election, which concluded by the Board of Directors on 27 June 2024, marks a significant milestone in the association's ongoing commitment to promote and advocate for geothermal energy globally.

        The newly elected leadership team includes:

        • President: Bjarni Palsson
        • Vice President: Suryantini
        • Treasurer: Jaime Quinao
        • Secretary: Adele Manzella

        Bjarni Palsson, the new President of IGA expressed excitement and gratitude, stating, "I am honoured to have been elected to lead the Board and govern the ongoing operations initiated worldwide. Together with the newly elected team, we are committed to driving forward our mission of advancing geothermal energy. Our focus will be on visibility, advocacy and creating impact for our members regarding policies and driving sustainability in each and every conversation."

        The election process was overseen by the appointed interim President Andy Blair ensuring a transparent and fair election. The entire Board thanks Andy Blair for her service and commitment.

        The IGA has been at the forefront of the geothermal sector since 1988, providing invaluable resources, advocacy, and support to its members. The newly elected leadership team is expected to build on this strong foundation, bringing fresh perspectives and innovative ideas to the table.
      `
    },
    {
      id: 2,
      image: strategyWorkImage,
      title: 'IGA Hosts Successful Strategy Workshop for Board of Directors',
      date: '21. September 2024',
      content: `
        Jakarta 16-17 September 2024 – The IGA held a productive strategy workshop with its Board of Directors, aimed at defining the organization's strategic direction and work program for the upcoming year. The workshop, facilitated by Bjarni Palsson (President of the IGA), brought together board members to engage in collaborative discussions and innovative brainstorming sessions.

        Key outcomes of the workshop included the identification of strategic priorities, alignment on organizational goals, and the establishment of actionable initiatives to enhance performance and impact. Board members expressed enthusiasm about the direction set forth with the three identified priorities and the commitment to drive forward the strategic plan.

        The three priorities are:

        1. Global Advocacy and Promotion of Geothermal outside Geothermal
        2. Road to Calgary for WGC26: Forging geothermal Innovation
        3. Building the IGA Academy: Leadership through Expertise

        "Our Board of Directors is dedicated to steering the IGA toward continued success," said Bjarni Palsson. "This workshop was a crucial step in ensuring we are aligned and prepared to tackle the challenges ahead."

        The organization looks forward to implementing the strategies developed during the workshop and to reporting on progress in the coming months.
      `
    },
    {
      id: 3,
      image: geothermal2Image,
      title: 'World Geothermal Congress 2020',
      subtitle: 'Reykjavik',
      content: `
        Ever since the World Geothermal Congress 2020 was postponed last spring, the WGC Organising Committee has been working hard planning a congress in May 2021. However, it has become clear that May this year is not possible either.

        In light of this, the Organising Committee has adapted WGC to the new situation we are all facing, while still guaranteeing that WGC 2020 will be an outstanding world class event, where Iceland's knowledge and experience in harnessing geothermal will be at the forefront.

        The outcome is World Geothermal Congress 2020+1, a series of monthly virtual events, where over 2,000 papers will be presented, giving the audience to interact with their respective authors and presenters. The highlight of WGC 2020+1 will be a three-day on-site/ hybrid conference in Harpa Conference Centre in Reykjavik, Iceland on 24-27 October 2021, this highlight event will be streamed on-line giving all those of our community that cannot still travel a chance to join the action.

        What was planned as a geothermal week in Reykjavik in 2020 will in effect become a geothermal semester, stretching from the virtual opening on March 30 towards the end of October 2021.

        The on-site in person event in Reykjavik will be the high point of WGC 2020+1. Turning a spotlight to all the highlights, industry leaders will convene in Harpa Conference Centre to discuss the most outstanding papers, the biggest challenges facing geothermal today and of course, how geothermal can improve its competitiveness and relevance, all the while contributing towards a sustainable and carbon neutral future of energy.

        We would like to thank all those registered and especially the sponsors & exhibitors for keeping their commitments with us throughout these uncertain past months. Without them there would have been no WGC 2020+1.

        It has been a long and hard journey but we cannot wait to welcome you, on-line and on-site!
      `
    },
  ];

  return (
    <>
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl font-bold text-[#FF6B35] mb-6">NEWSROOM</h1>
          <nav className="mb-8">
            <ul className="flex space-x-2 text-gray-600">
              <li>All</li>
              <li>/</li>
              <li>News</li>
            </ul>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-64"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 text-white">
                  <h2 className="text-3xl font-semibold mb-3">{item.title}</h2>
                  {item.subtitle && <p className="text-lg">{item.subtitle}</p>}
                  {item.date && <p className="text-sm mt-2">{item.date}</p>}
                </div>
                <div
                  className={`absolute inset-0 bg-[#FF6B35] bg-opacity-90 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className="text-white text-2xl font-semibold">Read More</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-4xl font-bold text-[#FF6B35]">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selectedItem.subtitle && (
              <p className="text-gray-600 mb-2">{selectedItem.subtitle}</p>
            )}
            {selectedItem.date && (
              <p className="text-gray-600 mb-4">{selectedItem.date}</p>
            )}
            {selectedItem.content && (
              <div className="prose max-w-none">
                {selectedItem.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}