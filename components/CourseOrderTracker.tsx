"use client";

import { useEffect, useMemo, useState } from "react";

type Lesson = { id: string; title: string };
type CourseModule = { id: string; title: string; lessons: Lesson[] };
type SavedState = { modules: CourseModule[]; completed: string[] };

const STORAGE_KEY = "tubio-course-order-v1";

function isCourseData(value: unknown): value is CourseModule[] {
  return Array.isArray(value) && value.every((module) => {
    if (!module || typeof module !== "object") return false;
    const candidate = module as CourseModule;
    return typeof candidate.id === "string" && typeof candidate.title === "string" &&
      Array.isArray(candidate.lessons) && candidate.lessons.every((lesson) =>
        lesson && typeof lesson.id === "string" && typeof lesson.title === "string");
  });
}

export function CourseOrderTracker({ initialModules }: { initialModules: CourseModule[] }) {
  const [modules, setModules] = useState<CourseModule[]>(initialModules);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedState;
        if (isCourseData(saved.modules) && Array.isArray(saved.completed)) {
          queueMicrotask(() => {
            if (cancelled) return;
            setModules(saved.modules);
            setCompleted(new Set(saved.completed));
            setReady(true);
          });
          return () => { cancelled = true; };
        }
      }
    } catch {
      // Si el almacenamiento fue limpiado o está corrupto, se conserva el orden inicial.
    }
    queueMicrotask(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const state: SavedState = { modules, completed: [...completed] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [completed, modules, ready]);

  const totals = useMemo(() => {
    const lessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    return { lessons, done: completed.size, percent: lessons ? Math.round((completed.size / lessons) * 100) : 0 };
  }, [completed, modules]);

  function toggleLesson(id: string) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function moveLesson(moduleId: string, lessonIndex: number, direction: -1 | 1) {
    setModules((current) => current.map((module) => {
      if (module.id !== moduleId) return module;
      const target = lessonIndex + direction;
      if (target < 0 || target >= module.lessons.length) return module;
      const lessons = [...module.lessons];
      [lessons[lessonIndex], lessons[target]] = [lessons[target], lessons[lessonIndex]];
      return { ...module, lessons };
    }));
  }

  function resetTracker() {
    if (!window.confirm("¿Restablecer el orden original y borrar todo el progreso guardado en este navegador?")) return;
    setModules(initialModules);
    setCompleted(new Set());
  }

  if (!ready) return <div className="order-empty">Cargando tu espacio local…</div>;

  return (
    <div className="order-tracker">
      <section className="order-overview" aria-label="Progreso general">
        <div>
          <span className="order-kicker">Progreso general</span>
          <strong>{totals.percent}%</strong>
          <p>{totals.done} de {totals.lessons} lecciones completadas</p>
        </div>
        <div className="order-progress" aria-label={`${totals.percent}% completado`}>
          <span style={{ width: `${totals.percent}%` }} />
        </div>
        <button className="order-reset" type="button" onClick={resetTracker}>Restablecer</button>
      </section>

      <div className="order-modules">
        {modules.map((module, moduleIndex) => {
          const done = module.lessons.filter((lesson) => completed.has(lesson.id)).length;
          return (
            <details className="order-module" key={module.id} open={moduleIndex === 0}>
              <summary>
                <span className="order-module-number">{String(moduleIndex + 1).padStart(2, "0")}</span>
                <span className="order-module-copy">
                  <strong>{module.title.replace(/^\d+\s*-\s*/, "")}</strong>
                  <small>{done}/{module.lessons.length} completadas</small>
                </span>
                <span className="order-module-percent">{Math.round((done / module.lessons.length) * 100)}%</span>
              </summary>

              <ol className="order-lessons">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isDone = completed.has(lesson.id);
                  return (
                    <li className={isDone ? "is-complete" : ""} key={lesson.id}>
                      <label>
                        <input type="checkbox" checked={isDone} onChange={() => toggleLesson(lesson.id)} />
                        <span className="order-check" aria-hidden="true" />
                        <span className="order-lesson-number">{String(lessonIndex + 1).padStart(3, "0")}</span>
                        <span className="order-lesson-title">{lesson.title}</span>
                      </label>
                      <span className="order-move-actions">
                        <button type="button" disabled={lessonIndex === 0} onClick={() => moveLesson(module.id, lessonIndex, -1)} aria-label={`Subir ${lesson.title}`}>↑</button>
                        <button type="button" disabled={lessonIndex === module.lessons.length - 1} onClick={() => moveLesson(module.id, lessonIndex, 1)} aria-label={`Bajar ${lesson.title}`}>↓</button>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </details>
          );
        })}
      </div>
    </div>
  );
}
