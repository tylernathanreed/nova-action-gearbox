<?php

namespace Reedware\NovaActionGearbox\Actions;

use Laravel\Nova\Nova;
use Illuminate\Http\Request;

class ForceDelete extends Action
{
    /**
     * The displayable name of the action.
     *
     * @var string
     */
    public $name = 'Force Delete';

    /**
     * The icon associated to this action.
     *
     * @var string|null
     */
    public $icon = 'force-delete';

    /**
     * The whether or not this action is destructive.
     *
     * @var boolean|null
     */
    public $destructive = true;

    /**
     * The endpoint for the form submission.
     *
     * @var string|null
     */
    public $endpoint = '/nova-api/{{resourceName}}/force';

    /**
     * The http request method used to submit the form.
     *
     * @var string|null
     */
    public $method = 'delete';

    /**
     * The heading for the action form.
     *
     * @var string|null
     */
    public $heading = 'Force Delete Resource';

    /**
     * The prompt for the action form.
     *
     * @var string|null
     */
    public $prompt = 'Are you sure you want to force delete this resource?';

    /**
     * The submit button text for the action form.
     *
     * @var string|null
     */
    public $submitButtonText = 'Force Delete';

    /**
     * Whether or not this action is available for a selection of multiple resources.
     *
     * @var boolean
     */
    public $availableForMultipleResources = false;

    /**
     * Determine if the action should be available for the given request.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return boolean
     */
    public function authorizedToSee(Request $request)
    {
        // Inject the required request parameters
        $this->injectRelationshipType($request);
        $this->injectViaManyToMany($request);

        // Make sure the relationship is not a pivot
        if($request->viaManyToMany) {
            return false;
        }

        // Check if the request is for a single resource
        if($this->authorizedToSeeIndividualUsingRequest($request) === false) {
            return false;
        }

        // Return the parent result
        return parent::authorizedToSee($request);
    }

    /**
     * Determine if the action is executable for the given request.
     *
     * @param  \Illuminate\Http\Request             $request
     * @param  \Illuminate\Database\Eloquent\Model  $model
     *
     * @return boolean
     */
    public function authorizedToRun(Request $request, $model)
    {
        // Determine the resource from the model
        $resource = Nova::newResourceFromModel($model);

        // Make sure the user is authorized to force delete the resource
        if(!$resource->authorizedToForceDelete($request)) {
            return false;
        }

        // Make sure the resource has been soft deleted
        if(!$resource->isSoftDeleted()) {
            return false;
        }

        // Return the parent result
        return parent::authorizedToRun($request, $model);
    }

    /**
     * Returns whether or not the action is available for the specified model on the given request.
     *
     * @param  \Illuminate\Http\Request             $request
     * @param  \Illuminate\Database\Eloquent\Model  $model
     *
     * @return boolean
     */
    public function authorizedToSeeIndividual(Request $request, $model)
    {
        // Determine the resource from the model
        $resource = Nova::newResourceFromModel($model);

        // Make sure the user is authorized to force delete the resource
        if(!$resource->authorizedToForceDelete($request)) {
            return false;
        }

        // Make sure the resource has been soft deleted
        if(!$resource->isSoftDeleted()) {
            return false;
        }

        // Return the parent result
        return parent::authorizedToSeeIndividual($request, $model);
    }
}