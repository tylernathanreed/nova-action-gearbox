<?php

namespace Reedware\NovaActionGearbox;

use Laravel\Nova\Nova;
use Laravel\Nova\Events\ServingNova;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Reedware\NovaActionGearbox\Http\Middleware\Authorize;
use Laravel\Nova\Http\Requests\ActionRequest as NovaActionRequest;

class NovaActionGearboxServiceProvider extends ServiceProvider
{
    /**
     * The priority-sorted list of actions.
     *
     * @var array
     */
    public static $actionPriority = [
        \Reedware\NovaActionGearbox\Actions\View::class,
        \Reedware\NovaActionGearbox\Actions\Edit::class,
        \Reedware\NovaActionGearbox\Actions\EditAttached::class,
        \Reedware\NovaActionGearbox\Actions\ResourceActionGroup::class,
        \Reedware\NovaActionGearbox\Actions\PivotActionGroup::class,
        \Reedware\NovaActionGearbox\Actions\Delete::class,
        \Reedware\NovaActionGearbox\Actions\Detach::class,
        \Reedware\NovaActionGearbox\Actions\Restore::class,
        \Reedware\NovaActionGearbox\Actions\ForceDelete::class,
    ];

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Nova::serving(function (ServingNova $event) {
            Nova::script('action-gearbox', __DIR__.'/../dist/js/action-gearbox.js');
        });

        Nova::provideToScript(['actionPriority' => static::$actionPriority]);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->aliasActionRequest();   
    }

    /**
     * Aliases the nova action request to our own action request.
     *
     * @return void
     */
    protected function aliasActionRequest()
    {
        $this->app->alias(ActionRequest::class, NovaActionRequest::class);
    }
}
