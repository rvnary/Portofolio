import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Will be added soon",
    description: "Will be added soon",
    image: "https://github.com/rvnary/Portofolio/blob/main/justintano/dummy-image.png?raw=true",
    tags: ["Coming", "Coming", "Coming"],
  },
  {
    id: 2,
    title: "Will be added soon",
    description: "Will be added soon",
    image: "https://github.com/rvnary/Portofolio/blob/main/justintano/dummy-image.png?raw=true",
    tags: ["Coming", "Coming", "Coming"],
  },
  {
    id: 3,
    title: "Will be added soon",
    description: "Will be added soon",
    image: "https://github.com/rvnary/Portofolio/blob/main/justintano/dummy-image.png?raw=true",
    tags: ["Coming", "Coming", "Coming"],
  },
  {
    id: 4,
    title: "Will be added soon",
    description: "Will be added soon",
    image: "https://github.com/rvnary/Portofolio/blob/main/justintano/dummy-image.png?raw=true",
    tags: ["Coming", "Coming", "Coming"],
  },
  {
    id: 5,
    title: "Will be added soon",
    description: "Will be added soon",
    image: "https://github.com/rvnary/Portofolio/blob/main/justintano/dummy-image.png?raw=true",
    tags: ["Coming", "Coming", "Coming"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative z-20 mt-[50vh] py-20 px-6" style={{ backgroundColor: '#E8D9D4' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A selection of my recent work showcasing various skills in design and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              style={{ backgroundColor: '#F8EFEA' }}
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <ExternalLink size={18} />
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
