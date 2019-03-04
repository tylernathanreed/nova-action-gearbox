## Nova Action Gearbox
Replaces the Nova Action Selector with a Gearbox Dropdown.

### Installation

#### Step 1: Require this Package

Require this package with composer.

```shell
composer require reedware/nova-action-gearbox
```

This package uses auto-discovery, so doesn't require you to manually add the service provider. Should you choose to do this manually, you can include the following class in your list of service providers:

```php
\Reedware\NovaActionGearbox\NovaActioNGearboxServiceProvider::class
```

#### Step 2: Update your base Resource

This package overrides some of the functionality of the base Resource. You'll have to update your base Resource in order to use the Action Gearbox. There are two ways to do this:

**Option A)** Extend the Action Gearbox Resource

```php
use Reedware\NovaActionGearbox\Resource as ActionGearboxResource;

abstract class Resource extends ActionGearboxResource
{
  /* ... */
}
```

This is the easiest, and recommended solution.

**Option B)** Use the Action Gearbox Resource Trait

```php
use Laravel\Nova\Resource as NovaResource;
use Reedware\NovaActionGearbox\HasGearboxActions;

abstract class Resource extends NovaResource
{
  use HasGearboxActions;
}
```

This is the alternative solution for when you can't, or prefer not to, extend the Resource class that comes with this package.

#### Step 3: Update your base Lens

Lenses can come with actions too, therefore this package requires a small override for them. You'll have to update your base Lens in order to use the Action Gearbox. There are two ways to do this:

**Option A)** Extend the Action Gearbox Lens

```php
use Reedware\NovaActionGearbox\Lenses\Lens as ActionGearboxLens;

abstract class Lens extends ActionGearboxLens
{
  /* ... */
}
```

This is the easiest, and recommended solution.

**Option B)** Use the Action Gearbox Lens Traits

```php
use Laravel\Nova\Lenses\Lens as NovaLens;
use Reedware\NovaActionGearbox\Lenses\GuessesResource;
use Reedware\NovaActionGearbox\ResolvesGearboxActions;

abstract class Lens extends NovaLens
{
  use ResolvesGearboxActions, GuessesResource;
}
```

#### Step 4: Update your base Action

Actions are the name of the game here. You'll have to update your base Action in order to use the Action Gearbox. Unlike the previous two steps, there's only one way to do this: extend the Action Gearbox Action.

```php
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Reedware\NovaActionGearbox\Actions\Action as ActionGearboxAction;

class Action extends ActionGearboxAction
{
    use InteractsWithQueue, Queueable, SerializesModels;
}
```

You don't have to include the traits from Illuminate, these are only shown as an example.
