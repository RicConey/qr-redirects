// app/page.js
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/home.module.css';

export default function Home() {
    return (
        <>
            {/* ШАПКА */}
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    {/* Верхняя часть: лого, текст и кнопка входа (в одном flex-контейнере) */}
                    <div className={styles.topRow}>
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/logo.svg"
                                alt="NKZ Logo"
                                width={50}
                                height={150}
                                priority
                                className={styles.logo}
                            />
                        </div>
                        <div className={styles.textWrapper}>
                            <h1 className={styles.decoding}>
                                Новація<br />
                                Коротких<br />
                                З&#39;єднань
                            </h1>
                        </div>
                        <div className={styles.loginRow}>
                            <Link href="/auth/signin" className={styles.loginButton}>
                                Войти
                            </Link>
                        </div>
                    </div>

                    {/* Слоган */}
                    <div className={styles.sloganRow}>
                        <p className={styles.slogan}>Лаконічність у кожному QR</p>
                    </div>
                </div>
            </header>

            {/* ОСНОВНОЙ КОНТЕНТ */}
            <main className={styles.mainContainer}>
                {/* Блок "Услуги" (4 карточки) */}
                <section className={styles.cardsContainer}>
                    <div className={styles.card}>
                        <h3>Компактні QR-коди</h3>
                        <p>Мінімальний розмір коду дозволяє легко розміщувати його будь-де.</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Гнучке управління посиланнями</h3>
                        <p>Миттєве редагування посилань без заміни QR-коду.</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Аналітика і звітність</h3>
                        <p>Статистика переходів для кращого розуміння аудиторії.</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Надійність та швидкість</h3>
                        <p>Швидкий перехід завдяки надійній інфраструктурі.</p>
                    </div>
                </section>

                {/* "Як це працює" */}
                <section className={styles.cardsContainer}>
                    <div className={styles.card}>
                        <h2>Як це працює</h2>
                        <ul className={styles.list}>
                            {[
                                'Створіть QR-код для вашого посилання.',
                                'Розмістіть QR-код на фізичному або цифровому носії.',
                                'Користувач сканує та миттєво переходить за посиланням.',
                                'Змінюйте кінцеву адресу без заміни QR-коду.'
                            ].map((step, idx) => (
                                <li key={idx}>✅ {step}</li>
                            ))}
                            <li>
                                ℹ️ Посилання має вигляд:
                                <span className={styles.fakeLink}> https://www.nkz.com.ua/ВАШ_текст </span>
                                &nbsp;(або будь-який набір символів від 4 знаків). Приклад:
                            </li>
                        </ul>

                        {/* QR-код под текстом */}
                        <div className={styles.qrWrapper}>
                            <Image
                                src="/qr_demo.svg"
                                alt="Пример QR"
                                width={80}
                                height={80}
                                className={styles.qrDemo}
                            />
                        </div>
                    </div>
                </section>

                {/* "Сфери застосування" */}
                <section className={styles.cardsContainer}>
                    <div className={styles.card}>
                        <h2>Сфери застосування</h2>
                        <ul className={styles.list}>
                            {[
                                'Реклама та маркетинг',
                                'Події та заходи',
                                'Кафе та ресторани',
                                'Візитні картки та поліграфія'
                            ].map((area, idx) => (
                                <li key={idx}>📌 {area}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Контакт - e-mail */}
                <section className={styles.cardsContainer}>
                    <div className={styles.card}>
                        <h2>Залишились запитання?</h2>
                        <p>Ми готові відповісти на них та запропонувати найкращі рішення саме для вас.</p>
                        <p style={{ margin: '0.75rem 0 0', fontSize: '1.05rem' }}>
                            <a
                                href="mailto:info@nkz.com.ua"
                                style={{ color: '#3B82F6', textDecoration: 'underline' }}
                            >
                                info@nkz.com.ua
                            </a>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}
