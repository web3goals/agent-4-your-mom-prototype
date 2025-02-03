import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

/**
 * A component with an entity list.
 */
export default function EntityList<T>(props: {
  entities: T[] | undefined;
  renderEntityCard: (entity: T, key: number) => ReactNode;
  noEntitiesText: string;
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Not empty list */}
      {props.entities &&
        props.entities.length > 0 &&
        props.entities.map((entity, index) =>
          props.renderEntityCard(entity, index)
        )}
      {/* Empty list */}
      {props.entities && props.entities.length === 0 && (
        <div className="w-full flex flex-col items-center border rounded px-4 py-4">
          <p className="text-sm text-muted-foreground">
            {props.noEntitiesText}
          </p>
        </div>
      )}
      {/* Loading list */}
      {!props.entities && <Skeleton className="w-full h-8" />}
    </div>
  );
}
