// app/page.js
import { notFound } from 'next/navigation';

export default function Home() {
  // При заходе на главную сразу возвращаем 404
  notFound();
}
