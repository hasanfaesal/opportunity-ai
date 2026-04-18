from fastapi import Depends


def noop():
    pass


DependAuth = Depends(noop)
DependPermisson = Depends(noop)
