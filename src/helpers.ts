export function computeDomain(entityId: string): string {
  return entityId.substr(0, entityId.indexOf("."));
}

export function computeEntity(entityId: string): string {
  return entityId.substr(entityId.indexOf(".") + 1)
}
