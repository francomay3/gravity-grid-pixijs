import { Space } from ".";
import { getColorAfterColission } from "../colorUtils";
import { Coordinates } from "../Coordinates";
import { getPositionAfterCollission, getSpeedAfterCollission } from "../utils";

export const update = (space: Space, delta: number) => {
  for (let i = 0; i < space.planets.length; i++) {
    const planetA = space.planets[i];
    for (let j = i + 1; j < space.planets.length; j++) {
      const planetB = space.planets[j];
      if (planetB.willDestroy || planetA.willDestroy) {
        continue;
      }
      const distance = planetA.getPosition().distanceTo(planetB.getPosition());

      if (distance < planetA.radius + planetB.radius) {
        planetA.willDestroy = true;
        const newMass = planetA.mass + planetB.mass;
        const newSpeed = getSpeedAfterCollission(planetA, planetB);
        const newPosition = getPositionAfterCollission(planetA, planetB);
        const newColor = getColorAfterColission(
          planetA.color,
          planetA.mass,
          planetB.color,
          planetB.mass
        );
        planetB.setSpeed(newSpeed);
        planetB.setMass(newMass);
        planetB.setPosition(newPosition);
        planetB.setColor(newColor);
        planetB.redraw();
        continue;
      }

      const forceMagnitude =
        space.G *
        ((planetA.getMass() * planetB.getMass()) / (distance * distance));

      const dx = planetB.getPosition().x - planetA.getPosition().x;
      const dy = planetB.getPosition().y - planetA.getPosition().y;

      const force = new Coordinates(
        forceMagnitude * (dx / distance),
        forceMagnitude * (dy / distance)
      );

      planetA.addForce(force);
      planetB.addForce(force.inverse());
    }
  }

  space.planets.forEach((planet) => {
    if (planet.willDestroy) {
      space.destroyPlanet(planet);
    } else {
      planet.update(delta);
    }
  });
};
