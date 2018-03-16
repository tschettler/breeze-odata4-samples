import { Component } from '@angular/core';
import { config, EntityManager, EntityQuery, core } from 'breeze-client';
import { OData4DataService, OData4UriBuilder } from 'breeze-odata4';
import { EntityType } from 'breeze-client';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Breeze OData 4 Explorer';

  public entityType: EntityType = null;
  public entityTypes: EntityType[] = [];
  public data: any[];
  public endpoints: { name: string, endpoint: string }[] = [
    { name: 'Northwind', endpoint: 'V4/Northwind/Northwind.svc' },
    // breeze.js needs PR #217 for these samples to work
    /*     { name: 'Products', endpoint: 'V4/OData/OData.svc' },
        { name: 'TripPin', endpoint: 'V4/(S(jndgbgy2tbu1vjtzyoei2w3e))/TripPinServiceRW' },
        { name: 'TripPin RESTier', endpoint: 'TripPinRESTierService/(S(gzxszdjtr4rxshzgv3mlsys3))' } */
  ];

  public selectedEndpoint: string;

  public manager: EntityManager;

  constructor() {
    OData4UriBuilder.register();
    OData4DataService.register();

    config.initializeAdapterInstance('uriBuilder', 'OData4', true);
    config.initializeAdapterInstance('dataService', 'OData4', true);

    const ds = <OData4DataService>config.getAdapterInstance('dataService', 'OData4');
    ds.metadataAcceptHeader = 'application/xml';

    if (this.endpoints.length === 1) {
      this.selectedEndpoint = this.endpoints[0].endpoint;
      this.setManager(this.selectedEndpoint);
    }
  }

  public setManager(endpoint: string): void {
    this.entityTypes = [];
    this.entityType = null;

    if (!endpoint || endpoint === 'undefined') {
      this.manager = null;
      return;
    }

    this.manager = new EntityManager(`api/${endpoint}`);

    this.manager.fetchMetadata().then(() => {
      this.entityTypes = <EntityType[]>this.manager.metadataStore.getEntityTypes()
        .filter((et: any) => (et instanceof EntityType) && !!et.defaultResourceName);
    });
  }

  public getData(entityTypeName: string): void {
    this.entityType = null;

    if (!entityTypeName) {
      return;
    }

    this.entityType = <EntityType>this.manager.metadataStore.getEntityType(entityTypeName);
    const query = EntityQuery.from(this.entityType.defaultResourceName);

    this.manager.executeQuery(query)
      .then(res => this.data = res.results)
      .catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  public getValue(value: any) {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (value instanceof Object) {

      if (value.entityAspect || value.complexAspect) {
        value = this.manager.helper.unwrapInstance(value, null);
      }

      const values = Object.keys(value).map(k => {
        let val = value[k];
        if (val instanceof Object) {
          val = this.getValue(val);
        }
        return val;
      });
      return values.join('<br>');
    }

    return value;
  }
}
