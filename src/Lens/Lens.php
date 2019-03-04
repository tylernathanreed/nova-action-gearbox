<?php

namespace Reedware\NovaActionGearbox\Lenses;

use Laravel\Nova\Lenses\Lens as NovaLens;
use Reedware\NovaActionGearbox\ResolvesGearboxActions;

abstract class Lens extends NovaLens
{
    use ResolvesGearboxActions, GuessesResource;
}