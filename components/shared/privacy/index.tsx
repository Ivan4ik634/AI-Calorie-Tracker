'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SECTIONS = [
  {
    title: 'Які дані ми зберігаємо',
    body: 'Додаток зберігає лише ті дані, які ви вводите самостійно: ім\u2019я, вагу, ціль, записи про їжу та налаштування. Ці дані зберігаються локально на вашому пристрої.',
  },
  {
    title: 'Ми не передаємо ваші дані',
    body: 'Ми не продаємо, не передаємо та не ділимося вашими персональними даними з третіми сторонами. Ваші дані залишаються тільки у вас.',
  },
  {
    title: 'Фотографії їжі',
    body: 'Фото використовуються виключно для аналізу страви. Вони не публікуються та не надсилаються третім сторонам без вашої згоди.',
  },
  {
    title: 'Очищення даних',
    body: 'Якщо ви натиснете «Очистити дані» в налаштуваннях, буде повністю видалено всю інформацію: записи щоденника, цілі, ім\u2019я, вагу та налаштування. Відновити їх буде неможливо.',
  },
  {
    title: 'Ваш контроль',
    body: 'Ви в будь-який момент можете змінити або видалити свої дані. Додаток не збирає дані у фоновому режимі.',
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-5 px-4 pb-6 pt-6">
        <header className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="size-5" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Політика конфіденційності</h1>
        </header>

        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="space-y-1.5 rounded-2xl border border-border/60 bg-card p-4">
              <h2 className="text-sm font-semibold">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </main>

      <BottomNav
        active="profile"
        onNavigate={(id) => router.push(id === 'home' ? '/' : `/${id}`)}
      />
    </div>
  );
}
