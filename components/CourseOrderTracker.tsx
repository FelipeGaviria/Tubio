"use client";

import { DragEvent, useEffect, useMemo, useRef, useState } from "react";

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

function mergeCourseData(savedModules: CourseModule[], initialModules: CourseModule[]) {
  const initialById = new Map(initialModules.map((module) => [module.id, module]));
  const merged = savedModules
    .filter((module) => initialById.has(module.id))
    .map((module) => {
      const current = initialById.get(module.id)!;
      const savedLessonIds = new Set(module.lessons.map((lesson) => lesson.id));
      return {
        ...current,
        lessons: [...module.lessons, ...current.lessons.filter((lesson) => !savedLessonIds.has(lesson.id))],
      };
    });
  const savedModuleIds = new Set(savedModules.map((module) => module.id));
  return [...merged, ...initialModules.filter((module) => !savedModuleIds.has(module.id))];
}

export function CourseOrderTracker({ initialModules }: { initialModules: CourseModule[] }) {
  const [modules, setModules] = useState<CourseModule[]>(initialModules);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const draggedLesson = useRef<{ moduleId: string; lessonIndex: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedState;
        if (isCourseData(saved.modules) && Array.isArray(saved.completed)) {
          queueMicrotask(() => {
            if (cancelled) return;
            setModules(mergeCourseData(saved.modules, initialModules));
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
  }, [initialModules]);

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

  function startDragging(event: DragEvent<HTMLButtonElement>, moduleId: string, lessonIndex: number, lessonId: string) {
    draggedLesson.current = { moduleId, lessonIndex };
    setDraggingId(lessonId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${moduleId}:${lessonIndex}`);
    const lessonRow = event.currentTarget.closest("li");
    if (lessonRow) event.dataTransfer.setDragImage(lessonRow, lessonRow.clientWidth - 24, 24);
  }

  function dropLesson(moduleId: string, targetIndex: number) {
    const source = draggedLesson.current;
    draggedLesson.current = null;
    setDraggingId(null);
    setDropTargetId(null);
    if (!source || source.moduleId !== moduleId || source.lessonIndex === targetIndex) return;
    setModules((current) => current.map((module) => {
      if (module.id !== moduleId) return module;
      const lessons = [...module.lessons];
      const [lesson] = lessons.splice(source.lessonIndex, 1);
      lessons.splice(targetIndex, 0, lesson);
      return { ...module, lessons };
    }));
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
                    <li
                      className={[
                        isDone ? "is-complete" : "",
                        draggingId === lesson.id ? "is-dragging" : "",
                        dropTargetId === lesson.id && draggingId !== lesson.id ? "is-drop-target" : "",
                      ].filter(Boolean).join(" ")}
                      key={lesson.id}
                      onDragEnter={() => {
                        if (draggedLesson.current?.moduleId === module.id) setDropTargetId(lesson.id);
                      }}
                      onDragOver={(event) => {
                        if (draggedLesson.current?.moduleId !== module.id) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        dropLesson(module.id, lessonIndex);
                      }}
                    >
                      <label>
                        <input type="checkbox" checked={isDone} onChange={() => toggleLesson(lesson.id)} />
                        <span className="order-check" aria-hidden="true" />
                        <span className="order-lesson-number">{String(lessonIndex + 1).padStart(3, "0")}</span>
                        <span className="order-lesson-title">{lesson.title}</span>
                      </label>
                      <button
                        className="order-drag-handle"
                        type="button"
                        draggable
                        onDragStart={(event) => startDragging(event, module.id, lessonIndex, lesson.id)}
                        onDragEnd={() => {
                          draggedLesson.current = null;
                          setDraggingId(null);
                          setDropTargetId(null);
                        }}
                        aria-label={`Arrastrar ${lesson.title}`}
                        title="Arrastra para cambiar de posición"
                      >⠿</button>
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
