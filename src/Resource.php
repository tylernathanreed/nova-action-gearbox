<?php

namespace Reedware\NovaActionGearbox;

use Laravel\Nova\Resource as NovaResource;

abstract class Resource extends NovaResource
{
	use HasGearboxActions;
}