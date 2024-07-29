import { Vector3 } from "three";

export function addRandomRotation(vector: Vector3, min: number, max: number) {
    const currentAngle = Math.atan2(vector.y, vector.x);
    const randomAngle =
        ((Math.random() *
            (max - min) +
            min) *
            Math.PI) /
        180;
    const newAngle = currentAngle + randomAngle;
    const length = vector.length();
    return new Vector3(
        Math.cos(newAngle) * length,
        Math.sin(newAngle) * length,
        0
    );
}