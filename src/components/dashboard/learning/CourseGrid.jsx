// src/components/learning/CourseGrid.jsx
import React, { useState } from 'react';
import CourseCard from './CourseCard';

function CourseGrid() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      status: 'completed',
      type: '📹 Video',
      duration: '8h',
      category: 'Frontend',
      level: 'Beginner',
      title: 'HTML5 & CSS3 Mastery – Semantic & Modern Layout',
      description: 'Nắm vững HTML semantic, Flexbox, Grid layout và responsive design.',
      instructor: 'Nguyễn Văn Hùng',
      lessons: 42,
      students: 12400,
      rating: 4.9,
      progress: 0,
      tags: ['HTML', 'CSS', 'Flexbox'],
      imgBg: '#111827'
    },
    {
      id: 2,
      status: 'completed',
      type: '📹 Video',
      duration: '15h',
      category: 'Frontend',
      level: 'Intermediate',
      title: 'JavaScript ES2024 – Deep Dive từ cơ bản đến nâng cao',
      description: 'Event loop, closures, async/await, Proxy, modules và cấu trúc dữ liệu.',
      instructor: 'Trần Hoàng An',
      lessons: 78,
      students: 9600,
      rating: 4.8,
      progress: 0,
      tags: ['JavaScript', 'ES6+', 'Async'],
      isCodePreview: true,
      imgBg: '#064e3b'
    },
    {
      id: 3,
      status: 'learning',
      type: '⚙ Kết hợp',
      duration: '18h',
      category: 'CS Fundamentals',
      level: 'Intermediate',
      title: 'Data Structures & Algorithms với JavaScript',
      description: 'Arrays, LinkedList, Trees, Graphs, Dynamic Programming – giải 60+ LeetCode.',
      instructor: 'Phạm Đức Anh',
      lessons: 95,
      students: 6700,
      rating: 4.9,
      progress: 61,
      tags: ['DSA', 'Algorithms', 'Big-O'],
      imgBg: '#1e1b4b'
    },
    {
      id: 4,
      status: 'not-started',
      isRegistered: false,
      type: '🛠 Project',
      duration: '20h',
      category: 'Frontend',
      level: 'Intermediate',
      title: 'React 19 – Hooks, Concurrent Mode & Performance',
      description: 'useTransition, Suspense, Server Components và xây dựng 3 Project thực tế.',
      instructor: 'Hoàng Tuấn Anh',
      lessons: 52,
      students: 8400,
      rating: 4.7,
      progress: 0,
      tags: ['React', 'TypeScript', 'Hooks'],
      imgBg: '#083344'
    }
    // Bạn có thể copy nhân bản thêm cấu trúc JSON này để đổ đầy đủ 12 bài học giống như ảnh
  ]);

  return (
    <div className="row g-4">
      {courses.map((course) => (
        <div className="col-12 col-md-6 col-xl-4" key={course.id}>
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
}

export default CourseGrid;
